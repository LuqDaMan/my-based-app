// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-contracts/contracts/access/Ownable.sol";
import "openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";

/**
 * @title ChemistryLab
 * @dev Prediction market contract for couple relationship milestones
 * MVP version for BAEsed Chemistry Lab - supports USDC backing with multipliers
 */
contract ChemistryLab is Ownable, ReentrancyGuard {
    IERC20 public immutable usdc;
    
    // Minimum backing amounts in USDC (6 decimals)
    uint256 public constant MIN_BACKING_AMOUNT = 500000; // $0.50 USDC
    
    struct Couple {
        string metadataURI; // IPFS link to couple data
        bool exists;
        uint256 createdAt;
    }
    
    struct Milestone {
        uint256 multiplier; // 100 = 1.0x, 200 = 2.0x (basis points)
        uint256 deadline;
        uint256 totalBacked;
        uint256 totalBackers;
        bool resolved;
        bool successful;
        uint256 minBackingAmount;
    }
    
    struct UserBacking {
        uint256 amount;
        bool claimed;
    }
    
    // couple ID => Couple data
    mapping(uint256 => Couple) public couples;
    
    // couple ID => milestone ID => Milestone data
    mapping(uint256 => mapping(uint256 => Milestone)) public milestones;
    
    // user => couple ID => milestone ID => UserBacking
    mapping(address => mapping(uint256 => mapping(uint256 => UserBacking))) public userBackings;
    
    uint256 public totalCouples;
    uint256 private constant MULTIPLIER_BASE = 100; // 1.0x = 100 basis points
    
    event CoupleAdded(uint256 indexed coupleId, string metadataURI);
    event MilestoneAdded(uint256 indexed coupleId, uint256 indexed milestoneId, uint256 multiplier, uint256 deadline, uint256 minAmount);
    event CoupleBacked(address indexed user, uint256 indexed coupleId, uint256 indexed milestoneId, uint256 amount);
    event MilestoneResolved(uint256 indexed coupleId, uint256 indexed milestoneId, bool successful);
    event WinningsClaimed(address indexed user, uint256 indexed coupleId, uint256 indexed milestoneId, uint256 amount);
    
    constructor(address _usdc, address _owner) Ownable(_owner) {
        usdc = IERC20(_usdc);
    }
    
    /**
     * @dev Add a new fictional couple (admin only)
     */
    function addCouple(string memory _metadataURI) external onlyOwner returns (uint256) {
        uint256 coupleId = totalCouples++;
        
        couples[coupleId] = Couple({
            metadataURI: _metadataURI,
            exists: true,
            createdAt: block.timestamp
        });
        
        emit CoupleAdded(coupleId, _metadataURI);
        return coupleId;
    }
    
    /**
     * @dev Add milestone for a couple (admin only)
     */
    function addMilestone(
        uint256 _coupleId,
        uint256 _milestoneId,
        uint256 _multiplier,
        uint256 _deadline,
        uint256 _minBackingAmount
    ) external onlyOwner {
        require(couples[_coupleId].exists, "Couple does not exist");
        require(_multiplier >= MULTIPLIER_BASE, "Multiplier must be >= 1.0x");
        require(_deadline > block.timestamp, "Deadline must be in future");
        require(_minBackingAmount >= MIN_BACKING_AMOUNT, "Min amount too low");
        require(milestones[_coupleId][_milestoneId].deadline == 0, "Milestone already exists");
        
        milestones[_coupleId][_milestoneId] = Milestone({
            multiplier: _multiplier,
            deadline: _deadline,
            totalBacked: 0,
            totalBackers: 0,
            resolved: false,
            successful: false,
            minBackingAmount: _minBackingAmount
        });
        
        emit MilestoneAdded(_coupleId, _milestoneId, _multiplier, _deadline, _minBackingAmount);
    }
    
    /**
     * @dev Back a couple on a specific milestone
     */
    function backCouple(uint256 _coupleId, uint256 _milestoneId, uint256 _amount) external nonReentrant {
        require(couples[_coupleId].exists, "Couple does not exist");
        
        Milestone storage milestone = milestones[_coupleId][_milestoneId];
        require(milestone.deadline != 0, "Milestone does not exist");
        require(block.timestamp < milestone.deadline, "Milestone deadline passed");
        require(!milestone.resolved, "Milestone already resolved");
        require(_amount >= milestone.minBackingAmount, "Amount below minimum");
        
        UserBacking storage userBacking = userBackings[msg.sender][_coupleId][_milestoneId];
        require(userBacking.amount == 0, "Already backed this milestone");
        
        // Transfer USDC from user
        require(usdc.transferFrom(msg.sender, address(this), _amount), "USDC transfer failed");
        
        // Record user backing
        userBacking.amount = _amount;
        
        // Update milestone totals
        milestone.totalBacked += _amount;
        milestone.totalBackers += 1;
        
        emit CoupleBacked(msg.sender, _coupleId, _milestoneId, _amount);
    }
    
    /**
     * @dev Resolve milestone outcome (admin only)
     */
    function resolveMarket(uint256 _coupleId, uint256 _milestoneId, bool _successful) external onlyOwner {
        require(couples[_coupleId].exists, "Couple does not exist");
        
        Milestone storage milestone = milestones[_coupleId][_milestoneId];
        require(milestone.deadline != 0, "Milestone does not exist");
        require(block.timestamp >= milestone.deadline, "Deadline not reached");
        require(!milestone.resolved, "Already resolved");
        
        milestone.resolved = true;
        milestone.successful = _successful;
        
        emit MilestoneResolved(_coupleId, _milestoneId, _successful);
    }
    
    /**
     * @dev Claim winnings for a successful prediction
     */
    function claimWinnings(uint256 _coupleId, uint256 _milestoneId) external nonReentrant {
        require(couples[_coupleId].exists, "Couple does not exist");
        
        Milestone storage milestone = milestones[_coupleId][_milestoneId];
        require(milestone.resolved, "Milestone not resolved");
        require(milestone.successful, "Milestone was not successful");
        
        UserBacking storage userBacking = userBackings[msg.sender][_coupleId][_milestoneId];
        require(userBacking.amount > 0, "No backing found");
        require(!userBacking.claimed, "Already claimed");
        
        userBacking.claimed = true;
        
        // For MVP: Simple 1:1 payout (return original backing amount)
        // TODO: Implement proper pool-based rewards in full version
        uint256 winnings = userBacking.amount;
        
        require(usdc.transfer(msg.sender, winnings), "USDC transfer failed");
        
        emit WinningsClaimed(msg.sender, _coupleId, _milestoneId, winnings);
    }
    
    /**
     * @dev Get user's backing info for a specific milestone
     */
    function getBackingInfo(address _user, uint256 _coupleId, uint256 _milestoneId) 
        external view returns (uint256 amount, bool claimed, uint256 potentialWinnings) 
    {
        UserBacking memory backing = userBackings[_user][_coupleId][_milestoneId];
        Milestone memory milestone = milestones[_coupleId][_milestoneId];
        
        amount = backing.amount;
        claimed = backing.claimed;
        
        if (amount > 0 && milestone.deadline != 0) {
            // For MVP: 1:1 payout 
            potentialWinnings = amount;
        }
    }
    
    /**
     * @dev Check if user can claim winnings
     */
    function canClaim(address _user, uint256 _coupleId, uint256 _milestoneId) 
        external view returns (bool) 
    {
        if (!couples[_coupleId].exists) return false;
        
        Milestone memory milestone = milestones[_coupleId][_milestoneId];
        if (!milestone.resolved || !milestone.successful) return false;
        
        UserBacking memory backing = userBackings[_user][_coupleId][_milestoneId];
        return backing.amount > 0 && !backing.claimed;
    }
    
    /**
     * @dev Emergency withdrawal (admin only) - for failed milestones
     */
    function emergencyWithdraw(uint256 _coupleId, uint256 _milestoneId) external onlyOwner {
        Milestone storage milestone = milestones[_coupleId][_milestoneId];
        require(milestone.resolved && !milestone.successful, "Not eligible for withdrawal");
        
        uint256 amount = milestone.totalBacked;
        milestone.totalBacked = 0;
        
        require(usdc.transfer(owner(), amount), "USDC transfer failed");
    }
    
    /**
     * @dev Get milestone details
     */
    function getMilestone(uint256 _coupleId, uint256 _milestoneId) 
        external view returns (
            uint256 multiplier,
            uint256 deadline, 
            uint256 totalBacked,
            uint256 totalBackers,
            bool resolved,
            bool successful,
            uint256 minBackingAmount
        )
    {
        Milestone memory milestone = milestones[_coupleId][_milestoneId];
        return (
            milestone.multiplier,
            milestone.deadline,
            milestone.totalBacked,
            milestone.totalBackers,
            milestone.resolved,
            milestone.successful,
            milestone.minBackingAmount
        );
    }
}