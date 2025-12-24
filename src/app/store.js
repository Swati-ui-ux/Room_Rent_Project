import { configureStore } from "@reduxjs/toolkit"
import themeReducer from "../features/themeSlice"
export let store = configureStore({
    reducer: {
    theme:themeReducer
    }
})