import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ReferralStats = {
  totalReferrals: number;
  referralVendors: number;
  convertedSubscriptions: number;
};

export type PendingPayout = {
  id: string;
  bonusAmount: number;
  payoutStatus: "pending" | "paid";
  createdAt: string;
  referrer: {
    id: string;
    fullName: string;
    email: string;
  };
  referredVendor: {
    id: string;
    userId: string;
    user: {
      fullName: string;
      email: string;
    };
  };
};

export type ReferralState = {
  stats: {
    loading: boolean;
    data: ReferralStats | null;
    error: string | null;
  };
  pendingPayouts: {
    loading: boolean;
    data: PendingPayout[];
    error: string | null;
  };
  selectedReferral: PendingPayout | null;
  isMarkingPaid: boolean;
  markingError: string | null;
};

// Demo data
const demoStats: ReferralStats = {
  totalReferrals: 145,
  referralVendors: 67,
  convertedSubscriptions: 98,
};

const demoPendingPayouts: PendingPayout[] = [
  {
    id: "ref-001",
    bonusAmount: 250.5,
    payoutStatus: "pending",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    referrer: {
      id: "user-001",
      fullName: "Ahmed Hassan",
      email: "ahmed.hassan@example.com",
    },
    referredVendor: {
      id: "vendor-001",
      userId: "user-101",
      user: {
        fullName: "Fatima Al-Mansouri",
        email: "fatima.mansouri@business.com",
      },
    },
  },
  {
    id: "ref-002",
    bonusAmount: 500.0,
    payoutStatus: "pending",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    referrer: {
      id: "user-002",
      fullName: "Mohammed Ali",
      email: "mohammed.ali@example.com",
    },
    referredVendor: {
      id: "vendor-002",
      userId: "user-102",
      user: {
        fullName: "Sara Ibrahim",
        email: "sara.ibrahim@business.com",
      },
    },
  },
  {
    id: "ref-003",
    bonusAmount: 175.75,
    payoutStatus: "pending",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    referrer: {
      id: "user-003",
      fullName: "Layla Noor",
      email: "layla.noor@example.com",
    },
    referredVendor: {
      id: "vendor-003",
      userId: "user-103",
      user: {
        fullName: "Omar Khan",
        email: "omar.khan@business.com",
      },
    },
  },
  {
    id: "ref-004",
    bonusAmount: 325.0,
    payoutStatus: "pending",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    referrer: {
      id: "user-004",
      fullName: "Zainab Ahmad",
      email: "zainab.ahmad@example.com",
    },
    referredVendor: {
      id: "vendor-004",
      userId: "user-104",
      user: {
        fullName: "Hassan Rashid",
        email: "hassan.rashid@business.com",
      },
    },
  },
  {
    id: "ref-005",
    bonusAmount: 450.25,
    payoutStatus: "pending",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    referrer: {
      id: "user-005",
      fullName: "Amira Saleh",
      email: "amira.saleh@example.com",
    },
    referredVendor: {
      id: "vendor-005",
      userId: "user-105",
      user: {
        fullName: "Khalid Al-Zahra",
        email: "khalid.alzahra@business.com",
      },
    },
  },
];

const initialState: ReferralState = {
  stats: {
    loading: false,
    data: demoStats,
    error: null,
  },
  pendingPayouts: {
    loading: false,
    data: demoPendingPayouts,
    error: null,
  },
  selectedReferral: null,
  isMarkingPaid: false,
  markingError: null,
};

const referralSlice = createSlice({
  name: "referral",
  initialState,
  reducers: {
    setStatsLoading(state, action: PayloadAction<boolean>) {
      state.stats.loading = action.payload;
    },
    setStatsData(state, action: PayloadAction<ReferralStats>) {
      state.stats.data = action.payload;
      state.stats.error = null;
    },
    setStatsError(state, action: PayloadAction<string>) {
      state.stats.error = action.payload;
      state.stats.loading = false;
    },
    setPayoutsLoading(state, action: PayloadAction<boolean>) {
      state.pendingPayouts.loading = action.payload;
    },
    setPayoutsData(state, action: PayloadAction<PendingPayout[]>) {
      state.pendingPayouts.data = action.payload;
      state.pendingPayouts.error = null;
    },
    setPayoutsError(state, action: PayloadAction<string>) {
      state.pendingPayouts.error = action.payload;
      state.pendingPayouts.loading = false;
    },
    setSelectedReferral(state, action: PayloadAction<PendingPayout | null>) {
      state.selectedReferral = action.payload;
    },
    setMarkingPaid(state, action: PayloadAction<boolean>) {
      state.isMarkingPaid = action.payload;
    },
    setMarkingError(state, action: PayloadAction<string | null>) {
      state.markingError = action.payload;
    },
    updatePayoutInList(state, action: PayloadAction<string>) {
      const referralId = action.payload;
      state.pendingPayouts.data = state.pendingPayouts.data.filter(
        (payout) => payout.id !== referralId,
      );
      state.selectedReferral = null;
      if (state.stats.data) {
        state.stats.data.convertedSubscriptions += 1;
      }
    },
    resetMarkingState(state) {
      state.isMarkingPaid = false;
      state.markingError = null;
    },
  },
});

export const {
  setStatsLoading,
  setStatsData,
  setStatsError,
  setPayoutsLoading,
  setPayoutsData,
  setPayoutsError,
  setSelectedReferral,
  setMarkingPaid,
  setMarkingError,
  updatePayoutInList,
  resetMarkingState,
} = referralSlice.actions;

export default referralSlice.reducer;
