import { createSlice } from "@reduxjs/toolkit"

let initialState = {
    toggle: false,
    
}
let themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        toggleTheme: (state, payload) => {
          state.toggle = !state.toggle
        }
    }
})


export const { toggleTheme } = themeSlice.actions

export default  themeSlice.reducer