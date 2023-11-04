// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../../src/LendBorrow.sol";
import "../../src/Bridge.sol";
import "../../src/NFT.sol";

contract CounterTest is Test {
    LendBorrow lendborrowcontract;
    Bridge bridge;
    SimpleNFT nft;

    address public immutable owner =
        address(0x0D9f77503dA9d5EC2497b1619Fc3c04464309859);

    function setUp() public {}

    function testDeposit() public {
        vm.createSelectFork("bsc_test");
        vm.deal(address(owner), 1000 ether);
        vm.startPrank(owner);
        lendborrowcontract = new LendBorrow(address(owner));
        bridge = new Bridge(
            payable(address(lendborrowcontract)),
            address(0x80aC94316391752A193C1c47E27D382b507c93F3)
        );
        // vm.deal(payable(address(bridge)),1 ether);
        vm.deal(payable(address(lendborrowcontract)),1 ether);
         vm.deal(payable(address(bridge)),1 ether);
        lendborrowcontract.setBridge(payable(address(bridge)));
        nft = new SimpleNFT();
        nft.mint(address(owner));
        uint256 tokenid = nft.tokenOfOwnerByIndex(address(owner), 0);
        lendborrowcontract.floorPriceOfNFT(address(nft), tokenid,100 ether);
        nft.approve(address(lendborrowcontract), tokenid);
        lendborrowcontract.depositNFT(address(nft), tokenid);
        vm.stopPrank();
    }
}
