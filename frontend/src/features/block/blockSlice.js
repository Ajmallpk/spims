// import { createSlice } from "@reduxjs/toolkit"

// const initialState = {
//   isAuthenticated: false,
//   isVerified: false,
//   verificationStatus: "NOT_SUBMITTED", 
//   profile: {},
// }

// const blockSlice = createSlice({
//   name: "block",
//   initialState,
//   reducers: {

//     signupBlock: (state, action) => {
//       state.isAuthenticated = true
//       state.profile = action.payload
//       state.verificationStatus = "NOT_SUBMITTED"
//     },

//     loginBlock: (state, action) => {
//       state.isAuthenticated = true
//       state.profile.email = action.payload.email
//     },

//     submitVerification: (state) => {
//       state.verificationStatus = "PENDING"
//     },

//     approveVerification: (state) => {
//       state.verificationStatus = "APPROVED"
//       state.isVerified = true
//     },

//     logoutBlock: (state) => {
//       state.isAuthenticated = false
//       state.isVerified = false
//       state.verificationStatus = "NOT_SUBMITTED"
//       state.profile = {}
//     }

//   }
// })

// export const {
//   signupBlock,
//   loginBlock,
//   submitVerification,
//   approveVerification,
//   logoutBlock
// } = blockSlice.actions

// export default blockSlice.reducer