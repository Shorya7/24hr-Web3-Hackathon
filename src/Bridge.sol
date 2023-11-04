// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {IWormholeRelayer} from "../lib/wormhole-solidity-sdk/src/interfaces/IWormholeRelayer.sol";
import {IWormholeReceiver} from "../lib/wormhole-solidity-sdk/src/interfaces/IWormholeReceiver.sol";

import "./LendBorrow.sol";
import "./IBridge.sol";

contract Bridge is IWormholeReceiver{
    uint256 private GAS_LIMIT_ADDBORROWINGPOWER = 48000000000000000;
    uint256 private GAS_LIMIT_REMOVEBORROWINGPOWER = 48000000000000000;

    address public immutable i_owner;
    LendBorrow public lendBorrow;
    IWormholeRelayer public immutable wormholeRelayer;

modifier ownerOnly {
        require(msg.sender == i_owner,"AddressIsNotOwner_Error");
         _;
    }

    constructor( address payable _lendBorrow, address _wormholeRelayer ) {
        lendBorrow = LendBorrow(_lendBorrow);
        i_owner = msg.sender;
        wormholeRelayer = IWormholeRelayer(_wormholeRelayer);
    }

    function updatelendBorrowAddress(address payable _lendBorrow) external ownerOnly {
    lendBorrow = LendBorrow(_lendBorrow);
    }

    function quoteFeeAddBorrowingPowerSend(
        uint16 destination
    ) public view returns (uint256) {
        //( uint256 cost,) = wormholeRelayer.quoteEVMDeliveryPrice(destination, 0, GAS_LIMIT_ADDBORROWINGPOWER);
         return uint256(345);
    }

    function quoteFeeRemoveBorrowingPowerSend(
        uint16 destination
    ) public view returns (uint256) {
        ( uint256 cost,) = wormholeRelayer.quoteEVMDeliveryPrice(destination, 0, GAS_LIMIT_ADDBORROWINGPOWER);
         return cost;
    }

    function receiveWormholeMessages(
        bytes memory payload,
        bytes[] memory,
        bytes32,
        uint16 sourceChain,
        bytes32 deliveryHash
    ) public payable override {
        require(msg.sender == address(wormholeRelayer), "Only relayer allowed");

        (uint16 messageType, uint256 DUSD_AMOUNT, address borrowerAddress) = abi.decode(
            payload,
            (uint16, uint256, address)
        );
        if (messageType == 1) {
            // AddBorrowingPower
            lendBorrow.addBorrowingPowerByBridge(borrowerAddress, DUSD_AMOUNT );
        } else if (messageType == 2) {
            // RemoveBorrowingPower
            lendBorrow.removeBorrowingPowerByBridge(borrowerAddress);
        } 
    }

    function AddBorrowingPowerSend(
        uint16 _destination,
        uint256 _DUSD_AMOUNT,
        address _borrower
    ) external payable {
         wormholeRelayer.sendPayloadToEvm{value:msg.value}(
            _destination,
            _borrower,
            abi.encode(1, _DUSD_AMOUNT, _borrower),
            0,
            GAS_LIMIT_ADDBORROWINGPOWER
        );
    }

    function RemoveBorrowingPowerSend(
        uint16 _destination,
        uint256 _DUSD_AMOUNT,
        address _borrower
    ) external payable {
        bytes memory message = abi.encode(2, _DUSD_AMOUNT, _borrower);
         uint256 cost = quoteFeeAddBorrowingPowerSend(_destination);
         wormholeRelayer.sendPayloadToEvm{value:msg.value}(
            _destination,
            _borrower,
            message,
            0,
            GAS_LIMIT_REMOVEBORROWINGPOWER
        );
    }
}