import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  video: null,
  comments: [],
  recommended: [],
  loading: false,
  error: null,
};

const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    setVideoData: (state, action) => {
      state.video = action.payload.video;
      state.comments = action.payload.comments || [];
    },
    setRecommendedVideos: (state, action) => {
      state.recommended = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },

    addComment: (state, action) => {
      state.comments.push(action.payload);
    },
    deleteComment: (state, action) => {
      state.comments = state.comments.filter(
        (comment) => comment.commentId !== action.payload
      );
    },

    editComment: (state, action) => {
      const { commentId, newText } = action.payload;
      const comment = state.comments.find(c => c.commentId === commentId);
      if (comment) {
        comment.text = newText;
      }
    },


  },
});

export const { setVideoData, setRecommendedVideos, setLoading, setError, addComment, deleteComment, editComment  } = videoSlice.actions;

export default videoSlice.reducer;
