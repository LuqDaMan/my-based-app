# MVP-Optimized Implementation Plan - Chemistry Lab
*4-Day Hackathon Sprint focused exclusively on demonstrating RelFi concepts*

## 🎯 MVP SCOPE: Chemistry Lab

**Goal**: Demonstrate the RelationshipFi economic model through a compelling prediction market experience where users back fictional couples to succeed in relationship milestones.

**What We're Building**: A mobile-first swipe interface where users can back couples with testnet USDC, see potential rewards, and claim winnings when couples succeed.

**What We're NOT Building**: Real dating profiles, complex privacy oracles, full RelFi treasury integration, or advanced gamification.

---

## 📦 TRANSFERABLE ASSETS FROM CURRENT BUILD

### ✅ **Keep and Adapt**
- **Next.js + TypeScript + Tailwind foundation** - Solid base
- **OnchainKit wallet integration** - Perfect for MVP
- **MiniKit/Farcaster integration** - Essential for social sharing
- **Swipe gesture mechanics** - Core to the experience
- **Zustand state management** - Simple and effective
- **Base Sepolia testnet configuration** - Ready for deployment
- **Foundry smart contract pipeline** - Needed for new contracts

### ❌ **Discard/Replace**
- **UserProfile.sol contract** - Too complex for MVP, replace with simple user tracking
- **Complex prediction market state** - Simplify to basic backing mechanics
- **Redis integration** - Use in-memory state for MVP speed
- **Existing mock data structure** - Replace with relationship-focused couple data
- **Complex API routes** - Streamline to essential endpoints only

---

## 🚀 4-DAY SPRINT PLAN

### **DAY 1: Smart Contract Foundation** 
*Focus: Get the economic engine working*

#### ⏰ **Morning (4 hours)**
**1.1. Deploy Simplified ChemistryLab.sol Contract**
- Create basic prediction market contract for couples
- Support multiple milestones per couple with different reward multipliers
- Implement USDC staking and basic claiming logic
- Add time-bound market resolution (admin-triggered for MVP)
- Deploy to Base Sepolia testnet

```solidity
// Key functions needed:
- backCouple(coupleId, milestoneId, amount) 
- claimWinnings(coupleId, milestoneId)
- resolveMarket(coupleId, milestoneId, successful) // Admin only
- getBackingInfo(user, coupleId) // Returns user's stakes
```

#### ⏰ **Afternoon (4 hours)**
**1.2. USDC Integration & Paymaster Setup**
- Configure testnet USDC contract integration
- Set up basic Paymaster for gasless backing transactions
- Test USDC transfers and approvals
- Implement transaction status tracking

**Deliverable**: Working smart contract that accepts USDC backing and distributes rewards

---

### **DAY 2: Core Frontend & Couple Data**
*Focus: Create compelling user experience*

#### ⏰ **Morning (4 hours)**
**2.1. Fictional Couple System**
- Create 20-30 compelling fictional couples with realistic profiles
- Design relationship scenarios with clear milestone timelines
- Build API endpoint `/api/couples` to serve couple data
- Add couple profile components with photos and compatibility highlights

**Couple Data Structure:**
```typescript
interface FictionalCouple {
  id: string;
  partner1: { name: string; age: number; bio: string; avatar: string; };
  partner2: { name: string; age: number; bio: string; avatar: string; };
  matchedAt: Date;
  chemistryScore: number; // Visual indicator
  milestones: Milestone[];
  backstory: string; // Why they might succeed
}
```

#### ⏰ **Afternoon (4 hours)**
**2.2. Chemistry Lab Interface**
- Adapt existing swipe mechanics for couple backing
- Create couple card design showing both partners
- Build milestone selection interface with multipliers
- Add backing amount input with USDC validation
- Implement "Back This Couple" vs "Skip" gestures

**Deliverable**: Swipeable couple feed with backing interface

---

### **DAY 3: Backing Flow & Claims System**
*Focus: Complete the economic loop*

#### ⏰ **Morning (4 hours)**
**3.1. Backing Transaction Flow**
- Connect frontend to ChemistryLab.sol contract
- Implement gasless backing with transaction status
- Add backing confirmation with potential rewards display
- Build transaction error handling and retry logic
- Create backing success animation and feedback

#### ⏰ **Afternoon (4 hours)**  
**3.2. Claims and Portfolio Interface**
- Build "My Backings" dashboard showing all user stakes
- Implement claims interface for winning predictions
- Add performance tracking (total backed, won, success rate)
- Create celebration UI for successful claims
- Build basic leaderboard showing top backers

**Deliverable**: Complete backing and claiming user experience

---

### **DAY 4: Polish & Social Features**
*Focus: Demo-ready experience and viral growth*

#### ⏰ **Morning (4 hours)**
**4.1. Social Sharing Integration**
- Implement MiniKit sharing for backing announcements
- Add couple success celebration posts
- Create shareable backing cards with potential rewards
- Build viral referral tracking (basic version)

#### ⏰ **Afternoon (4 hours)**
**4.2. Final Polish & Deployment**
- Add smooth animations and transitions
- Implement comprehensive error handling
- Create onboarding flow explaining RelFi concepts
- Deploy to production with monitoring
- Conduct end-to-end testing

**Deliverable**: Production-ready Chemistry Lab MVP

---

## 🎯 MVP FEATURE SPECIFICATIONS

### **Core Couple Backing Interface**

**Couple Cards:**
- Split-screen design showing both partners
- Limited profile info (age, photo, 2-line bio)
- Match date and "chemistry building" indicator
- Clear milestone options with reward multipliers

**Milestones Available:**
1. **"Exchange 50+ messages in 7 days"** - 2.0x multiplier, $0.50 min
2. **"Go on first date within 14 days"** - 1.5x multiplier, $1.00 min  
3. **"3+ dates in 30 days"** - 1.0x multiplier, $2.00 min
4. **"Still chatting after 30 days"** - 1.2x multiplier, $1.50 min

**Backing Flow:**
1. Swipe right on couple → "Back This Couple?" modal
2. Select milestone(s) and USDC amounts
3. Show potential rewards: "Back $2 → Potential win $4.50"
4. Confirm → Gasless transaction → Success animation

### **Portfolio Dashboard**

**My Backings Tab:**
- List of all backed couples with status
- "Active" (waiting for resolution)
- "Won" (claimable rewards)  
- "Lost" (no rewards, but shows support)
- Total backed, total won, success rate

**Claims Interface:**
- "Claim $X.XX" buttons for winning predictions
- Batch claiming for multiple wins
- Transaction status and confirmation
- Celebration animation with social sharing option

### **Leaderboard & Social**

**Community Stats:**
- Top backers by total winnings
- Highest success rate (min 5 backings)
- Most supportive (total couples backed)
- Recent big wins with celebration

**Social Sharing:**
- "I'm backing [Alex & Sam] to go on 3 dates! 💕 Think they'll make it?"
- Success celebrations: "[Couple] just hit their milestone! I called it! 🎉"
- Leaderboard achievements: "Top 10 Chemistry Expert this week! 📈"

---

## 📱 TECHNICAL SPECIFICATIONS

### **Smart Contract: ChemistryLab.sol**

```solidity
contract ChemistryLab {
    struct Couple {
        string metadataURI; // IPFS link to couple data
        bool exists;
    }
    
    struct Milestone {
        uint256 multiplier; // 100 = 1.0x, 200 = 2.0x
        uint256 deadline;
        uint256 totalBacked;
        uint256 totalBackers;
        bool resolved;
        bool successful;
    }
    
    mapping(uint256 => Couple) public couples;
    mapping(uint256 => mapping(uint256 => Milestone)) public milestones; // couple => milestone => data
    mapping(address => mapping(uint256 => mapping(uint256 => uint256))) public backings; // user => couple => milestone => amount
    
    function backCouple(uint256 coupleId, uint256 milestoneId, uint256 amount) external;
    function claimWinnings(uint256 coupleId, uint256 milestoneId) external;
    function resolveMarket(uint256 coupleId, uint256 milestoneId, bool successful) external onlyOwner;
}
```

### **Frontend Architecture**

**State Management (Zustand):**
```typescript
interface ChemistryLabStore {
  couples: FictionalCouple[];
  userBackings: UserBacking[];
  claimableRewards: ClaimableReward[];
  currentCoupleIndex: number;
  
  // Actions
  loadCouples: () => Promise<void>;
  backCouple: (coupleId: string, milestone: string, amount: bigint) => Promise<void>;
  claimReward: (coupleId: string, milestone: string) => Promise<void>;
  skipCouple: () => void;
}
```

**Key Components:**
- `CoupleCard.tsx` - Swipeable couple display
- `BackingModal.tsx` - Milestone selection and amount input
- `PortfolioDashboard.tsx` - User backings and claims
- `TransactionStatus.tsx` - Real-time transaction feedback

### **API Endpoints**

```typescript
// GET /api/couples - Returns all fictional couples
// GET /api/backings/[address] - Returns user's backing history  
// POST /api/admin/resolve - Admin endpoint to resolve milestones
// GET /api/leaderboard - Top backers and recent activity
```

---

## 🚨 MVP CONSTRAINTS & SIMPLIFICATIONS

### **Intentional Limitations**
- **No real dating profiles** - Only fictional couples to focus on prediction mechanics
- **Admin-triggered resolution** - No complex oracle, admin manually resolves milestones
- **Limited couple pool** - 20-30 pre-created couples, no dynamic generation
- **Basic reward calculation** - Simple multiplication, no complex DeFi yield
- **Testnet only** - Base Sepolia testnet USDC, not real money
- **Single milestone backing** - Users can only back one milestone per couple

### **Technical Shortcuts**
- **In-memory caching** - No Redis, use React Query for data caching
- **Static couple data** - Pre-generated JSON, no database
- **Simple transaction tracking** - Basic status, no complex retry logic
- **Minimal error handling** - Focus on happy path, basic error messages
- **No advanced animations** - Standard transitions, no complex gesture libraries

---

## 📊 SUCCESS METRICS FOR MVP

### **User Engagement**
- [ ] Smooth wallet connection and onboarding (< 30 seconds)
- [ ] Intuitive couple backing flow (< 3 taps from couple to confirmation)
- [ ] Clear reward potential display (users understand economics)
- [ ] Successful transaction completion (> 90% success rate)

### **Technical Functionality**  
- [ ] All smart contract functions working on testnet
- [ ] Gasless transactions functioning properly
- [ ] Claims system working end-to-end
- [ ] Social sharing integration operational

### **Demo Readiness**
- [ ] 5+ compelling fictional couples with clear backstories
- [ ] Multiple milestone types demonstrating different multipliers
- [ ] Working leaderboard with realistic data
- [ ] Smooth mobile experience on iOS/Android

### **Vision Communication**
- [ ] Clear explanation of RelFi positive-sum model
- [ ] Obvious upgrade path from MVP to full platform
- [ ] Demonstration that relationships can be investable assets
- [ ] Community aspect encouraging support over competition

---

## 🎯 POST-MVP ROADMAP PREVIEW

This MVP serves as the foundation for the full RelFi platform:

**Immediate Next Steps** (Week 1-2):
1. Replace ChemistryLab.sol with full BAEsedProtocol.sol
2. Integrate Morpho Treasury for real yield generation
3. Add real dating Discovery Mode
4. Implement privacy-preserving oracle

**Full Platform** (Month 1-3):
1. Real user profiles and matching
2. Complex milestone verification
3. Chemistry Expert progression system
4. Advanced community features and governance

The MVP will prove that **love can be an investable asset class** and that **community support creates positive-sum outcomes for relationships**! 💕✨