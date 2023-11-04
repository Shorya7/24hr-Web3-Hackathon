// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

interface IBridge {
    function updatelendBorrowAddress(address payable _lendBorrow) external;

    function quoteFeeAddBorrowingPowerSend(uint32 destination) external view returns (uint256);

    function quoteFeeRemoveBorrowingPowerSend(uint32 destination) external view returns (uint256);

    function receiveWormholeMessages(
        bytes memory payload,
        bytes[] memory,
        bytes32,
        uint16 sourceChain,
        bytes32 deliveryHash
    ) external payable;

    function AddBorrowingPowerSend(uint16 _destination, uint256 _DUSD_AMOUNT, address _borrower) external payable;

    function RemoveBorrowingPowerSend(uint32 _destination, uint256 _DUSD_AMOUNT, address _borrower) external payable;
}
