// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "forge-std/Script.sol";
import "../src/ChemistryLab.sol";

/**
 * @dev Deploy script for ChemistryLab contract on Base Sepolia
 * Usage: forge script script/DeployChemistryLab.s.sol --rpc-url baseSepolia --broadcast --verify
 */
contract DeployChemistryLabScript is Script {
    // Base Sepolia testnet USDC contract address
    address constant USDC_ADDRESS = 0x036CbD53842c5426634e7929541eC2318f3dCF7e;
    
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Deploying ChemistryLab contract...");
        console.log("Deployer:", deployer);
        console.log("USDC Address:", USDC_ADDRESS);
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy ChemistryLab contract
        ChemistryLab chemistryLab = new ChemistryLab(USDC_ADDRESS, deployer);
        
        vm.stopBroadcast();
        
        console.log("ChemistryLab deployed at:", address(chemistryLab));
        
        // Add some sample couples and milestones for testing
        setupSampleData(chemistryLab, deployerPrivateKey);
    }
    
    function setupSampleData(ChemistryLab chemistryLab, uint256 privateKey) internal {
        console.log("Setting up sample couples and milestones...");
        
        vm.startBroadcast(privateKey);
        
        // Add sample couples
        uint256 couple1 = chemistryLab.addCouple("ipfs://QmSampleCouple1MetadataHash");
        uint256 couple2 = chemistryLab.addCouple("ipfs://QmSampleCouple2MetadataHash");
        uint256 couple3 = chemistryLab.addCouple("ipfs://QmSampleCouple3MetadataHash");
        
        // Add milestones for couple 1
        // "Exchange 50+ messages in 7 days" - 2.0x multiplier, $0.50 min
        chemistryLab.addMilestone(
            couple1, 
            1, 
            200, // 2.0x multiplier
            block.timestamp + 7 days,
            500000 // $0.50 USDC (6 decimals)
        );
        
        // "Go on first date within 14 days" - 1.5x multiplier, $1.00 min
        chemistryLab.addMilestone(
            couple1,
            2,
            150, // 1.5x multiplier  
            block.timestamp + 14 days,
            1000000 // $1.00 USDC
        );
        
        // "3+ dates in 30 days" - 1.0x multiplier, $2.00 min
        chemistryLab.addMilestone(
            couple1,
            3,
            100, // 1.0x multiplier
            block.timestamp + 30 days,
            2000000 // $2.00 USDC
        );
        
        // "Still chatting after 30 days" - 1.2x multiplier, $1.50 min
        chemistryLab.addMilestone(
            couple1,
            4,
            120, // 1.2x multiplier
            block.timestamp + 30 days,
            1500000 // $1.50 USDC
        );
        
        // Add similar milestones for couple 2 and 3
        for (uint256 coupleId = couple2; coupleId <= couple3; coupleId++) {
            chemistryLab.addMilestone(coupleId, 1, 200, block.timestamp + 7 days, 500000);
            chemistryLab.addMilestone(coupleId, 2, 150, block.timestamp + 14 days, 1000000);
            chemistryLab.addMilestone(coupleId, 3, 100, block.timestamp + 30 days, 2000000);
            chemistryLab.addMilestone(coupleId, 4, 120, block.timestamp + 30 days, 1500000);
        }
        
        vm.stopBroadcast();
        
        console.log("Sample data setup complete!");
        console.log("Couple 1 ID:", couple1);
        console.log("Couple 2 ID:", couple2);
        console.log("Couple 3 ID:", couple3);
    }
}