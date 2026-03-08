const PostIssueButton = ({ onClick }) => {
  return (
    <div className="flex justify-end mb-4">
      <button
        onClick={onClick}
        className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white rounded-full px-5 py-2.5 text-sm font-semibold shadow-md transition-colors"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Post Issue
      </button>
    </div>
  );
};

export default PostIssueButton;