import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../apiService";
import { toast } from "react-toastify";
const initialState = {
  books: [],
  readinglist: [],
  bookDetail: null,
  status: null,
};

const fetchBooks = async ({ pageNum, limit, query }) => {
  try {
    let url = `/books?_page=${pageNum}&_limit=${limit}`;
    if (query) url += `&q=${query}`;
    const res = await API.get(url);
    return res;
  } catch (error) {
    return error;
  }
};

export const fetchData = createAsyncThunk("books/fetchData", async (props) => {
  const res = await fetchBooks(props);
  return res.data;
});

export const getBookDetail = createAsyncThunk(
  "books/getBookDetail",
  async (bookId) => {
    const res = await API.get(`/books/${bookId}`);
    return res.data;
  }
);

export const removeBook = createAsyncThunk(
  "books/removeBook",
  async (removeBookId) => {
    const res = await API.delete(`/favorites/${removeBookId}`);
    return res.data;
  }
);

export const getReadingList = createAsyncThunk(
  "books/getReadingList",
  async () => {
    const res = await API.get(`/favorites`);
    return res.data;
  }
);

export const addToReadingList = createAsyncThunk(
  "books/addToReadingList",
  async (book) => {
    const res = await API.post(`/favorites`, book);
    return res.data
  }
);

export const bookSlice = createSlice({
  name: "book",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.status = null;
        state.books = action.payload;
      })
      .addCase(fetchData.rejected, (state) => {
        state.status = "failured";
      });
    builder
      .addCase(getReadingList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getReadingList.fulfilled, (state, action) => {
        state.status = null;
        state.readinglist = action.payload;
      })
      .addCase(getReadingList.rejected, (state) => {
        state.status = "failured";
      });
    builder
      .addCase(getBookDetail.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getBookDetail.fulfilled, (state, action) => {
        state.status = null;
        state.bookDetail = action.payload;
      })
      .addCase(getBookDetail.rejected, (state) => {
        state.status = "failured";
      });
    builder
      .addCase(addToReadingList.pending, () => {})
      .addCase(addToReadingList.fulfilled, (state) => {
        state.status = null;
        toast.success("The book has been added to the reading list!");
      })
      .addCase(addToReadingList.rejected, (action) => {
        toast.error(action.error.message);
      });
    builder
      .addCase(removeBook.pending, (state) => {
        state.status = "pending";
      })
      .addCase(removeBook.fulfilled, (state) => {
        state.status = null;
        toast.success("The book has been removed");
      })
      .addCase(removeBook.rejected, (state) => {
        state.status = "Failed to remove book";
        toast.error("Failed to remove book");
      });
  },
});

export default bookSlice.reducer;
