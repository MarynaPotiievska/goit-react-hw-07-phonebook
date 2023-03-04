import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { addContact, deleteContact, editContact, fetchContacts } from "./contactsOperations";

const contactsInitialState = {
	items: [],
    isLoading: false,
    error: null
};

const extraActions = [addContact, deleteContact, editContact, fetchContacts];
const getActions = (type) => extraActions.map(action => action[type])


const contactsSlice = createSlice({
	name: "contacts",
	initialState: contactsInitialState,
	extraReducers: (builder) => {
		return builder.addCase(fetchContacts.fulfilled, (state, {payload}) => {
			state.items = payload
		}).addCase(addContact.fulfilled, (state, { payload }) => {
			state.items.push(payload);
		}).addCase(deleteContact.fulfilled, (state, { payload }) => {
			return state.items.filter(item => item.id !== payload)
		}).addCase(editContact.fulfilled, (state, { payload }) => {
			const editedContactIndex = state.items.findIndex(item => item.id === payload.id);
			state.items[editedContactIndex] = payload;
		}).addMatcher(isAnyOf(...getActions('pending'), state => {
			state.isLoading = true
		})).addMatcher(isAnyOf(...getActions('rejected')), (state, { payload }) => {
			state.isLoading = false;
			state.error = payload;
		}).addMatcher(isAnyOf(...getActions('fulfilled')), state => {
			state.isLoading = false;
			state.error = null;
		})
	}	
});

export const contactsReducer = contactsSlice.reducer;