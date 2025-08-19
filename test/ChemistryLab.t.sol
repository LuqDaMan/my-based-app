// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "forge-std/Test.sol";
import "../src/ChemistryLab.sol";
import "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

contract MockUSDC is ERC20 {
    constructor() ERC20("USD Coin", "USDC") {
        _mint(msg.sender, 1000000 * 10**6); // 1M USDC with 6 decimals
    }
    
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
    
    function decimals() public pure override returns (uint8) {
        return 6;
    }
}

contract ChemistryLabTest is Test {
    ChemistryLab public chemistryLab;
    MockUSDC public usdc;
    address public owner;
    address public user1;
    address public user2;
    
    function setUp() public {
        owner = address(this);
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");
        
        // Deploy mock USDC
        usdc = new MockUSDC();
        
        // Deploy ChemistryLab
        chemistryLab = new ChemistryLab(address(usdc), owner);
        
        // Give users some USDC
        usdc.mint(user1, 1000 * 10**6); // 1000 USDC
        usdc.mint(user2, 1000 * 10**6); // 1000 USDC
    }
    
    function testAddCouple() public {
        uint256 coupleId = chemistryLab.addCouple("ipfs://test-metadata");
        
        (string memory metadataURI, bool exists, uint256 createdAt) = chemistryLab.couples(coupleId);
        
        assertEq(metadataURI, "ipfs://test-metadata");
        assertTrue(exists);
        assertGt(createdAt, 0);
        assertEq(chemistryLab.totalCouples(), 1);
    }
    
    function testAddMilestone() public {
        uint256 coupleId = chemistryLab.addCouple("ipfs://test-metadata");
        
        chemistryLab.addMilestone(
            coupleId,
            1, // milestone ID
            200, // 2.0x multiplier
            block.timestamp + 7 days,
            500000 // $0.50 USDC
        );
        
        (
            uint256 multiplier,
            uint256 deadline,
            uint256 totalBacked,
            uint256 totalBackers,
            bool resolved,
            bool successful,
            uint256 minBackingAmount
        ) = chemistryLab.getMilestone(coupleId, 1);
        
        assertEq(multiplier, 200);
        assertEq(deadline, block.timestamp + 7 days);
        assertEq(totalBacked, 0);
        assertEq(totalBackers, 0);
        assertFalse(resolved);
        assertFalse(successful);
        assertEq(minBackingAmount, 500000);
    }
    
    function testBackCouple() public {
        uint256 coupleId = chemistryLab.addCouple("ipfs://test-metadata");
        chemistryLab.addMilestone(coupleId, 1, 200, block.timestamp + 7 days, 500000);
        
        uint256 backingAmount = 1000000; // $1.00 USDC
        
        // User1 approves and backs the couple
        vm.startPrank(user1);
        usdc.approve(address(chemistryLab), backingAmount);
        chemistryLab.backCouple(coupleId, 1, backingAmount);
        vm.stopPrank();
        
        // Check backing info
        (uint256 amount, bool claimed, uint256 potentialWinnings) = 
            chemistryLab.getBackingInfo(user1, coupleId, 1);
        
        assertEq(amount, backingAmount);
        assertFalse(claimed);
        assertEq(potentialWinnings, backingAmount); // 1:1 payout for MVP
        
        // Check milestone totals
        (, , uint256 totalBacked, uint256 totalBackers, , , ) = 
            chemistryLab.getMilestone(coupleId, 1);
        assertEq(totalBacked, backingAmount);
        assertEq(totalBackers, 1);
    }
    
    function testClaimWinnings() public {
        uint256 coupleId = chemistryLab.addCouple("ipfs://test-metadata");
        chemistryLab.addMilestone(coupleId, 1, 200, block.timestamp + 7 days, 500000);
        
        uint256 backingAmount = 1000000; // $1.00 USDC
        
        // User1 backs the couple
        vm.startPrank(user1);
        usdc.approve(address(chemistryLab), backingAmount);
        chemistryLab.backCouple(coupleId, 1, backingAmount);
        vm.stopPrank();
        
        // Fast forward past deadline
        vm.warp(block.timestamp + 8 days);
        
        // Resolve milestone as successful
        chemistryLab.resolveMarket(coupleId, 1, true);
        
        // Check can claim
        assertTrue(chemistryLab.canClaim(user1, coupleId, 1));
        
        // User1 claims winnings
        uint256 balanceBefore = usdc.balanceOf(user1);
        vm.prank(user1);
        chemistryLab.claimWinnings(coupleId, 1);
        
        uint256 expectedWinnings = backingAmount; // 1:1 payout for MVP
        assertEq(usdc.balanceOf(user1), balanceBefore + expectedWinnings);
        
        // Check backing marked as claimed
        (, bool claimed, ) = chemistryLab.getBackingInfo(user1, coupleId, 1);
        assertTrue(claimed);
    }
    
    function test_RevertWhen_BackingInsufficientAmount() public {
        uint256 coupleId = chemistryLab.addCouple("ipfs://test-metadata");
        chemistryLab.addMilestone(coupleId, 1, 200, block.timestamp + 7 days, 500000);
        
        // Try to back with amount below minimum
        vm.startPrank(user1);
        usdc.approve(address(chemistryLab), 100000); // $0.10 USDC
        vm.expectRevert("Amount below minimum");
        chemistryLab.backCouple(coupleId, 1, 100000);
        vm.stopPrank();
    }
    
    function test_RevertWhen_BackingAlreadyBacked() public {
        uint256 coupleId = chemistryLab.addCouple("ipfs://test-metadata");
        chemistryLab.addMilestone(coupleId, 1, 200, block.timestamp + 7 days, 500000);
        
        uint256 backingAmount = 1000000;
        
        // User1 backs the couple once
        vm.startPrank(user1);
        usdc.approve(address(chemistryLab), backingAmount * 2);
        chemistryLab.backCouple(coupleId, 1, backingAmount);
        
        // Try to back again - should fail
        vm.expectRevert("Already backed this milestone");
        chemistryLab.backCouple(coupleId, 1, backingAmount);
        vm.stopPrank();
    }
    
    function test_RevertWhen_ClaimingUnsuccessfulMilestone() public {
        uint256 coupleId = chemistryLab.addCouple("ipfs://test-metadata");
        chemistryLab.addMilestone(coupleId, 1, 200, block.timestamp + 7 days, 500000);
        
        uint256 backingAmount = 1000000;
        
        // User1 backs the couple
        vm.startPrank(user1);
        usdc.approve(address(chemistryLab), backingAmount);
        chemistryLab.backCouple(coupleId, 1, backingAmount);
        vm.stopPrank();
        
        // Fast forward and resolve as unsuccessful
        vm.warp(block.timestamp + 8 days);
        chemistryLab.resolveMarket(coupleId, 1, false);
        
        // Try to claim - should fail
        vm.prank(user1);
        vm.expectRevert("Milestone was not successful");
        chemistryLab.claimWinnings(coupleId, 1);
    }
}