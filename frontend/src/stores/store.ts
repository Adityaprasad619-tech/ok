import { configureStore } from '@reduxjs/toolkit';
import styleReducer from './styleSlice';
import mainReducer from './mainSlice';
import authSlice from './authSlice';

import usersSlice from "./users/usersSlice";
import campaignsSlice from "./campaigns/campaignsSlice";
import couponsSlice from "./coupons/couponsSlice";
import creatorsSlice from "./creators/creatorsSlice";
import subscriptionsSlice from "./subscriptions/subscriptionsSlice";
import transactionsSlice from "./transactions/transactionsSlice";

export const store = configureStore({
  reducer: {
    style: styleReducer,
    main: mainReducer,
    auth: authSlice,

users: usersSlice,
campaigns: campaignsSlice,
coupons: couponsSlice,
creators: creatorsSlice,
subscriptions: subscriptionsSlice,
transactions: transactionsSlice,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
