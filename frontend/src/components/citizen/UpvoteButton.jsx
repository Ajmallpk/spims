// citizen/components/UpvoteButton.jsx
import { useState } from 'react';
import { ThumbsUp } from 'lucide-react';

export default function UpvoteButton({ issueId, initialCount = 0, initialUpvoted = false }) {
  const [count, setCount] = useState(initialCount);
  const [upvoted, setUpvoted] = useState(initialUpvoted);
  const [loading, setLoading] = useState(false);

  const handleUpvote = async () => {
    if (loading) return;
    setLoading(true);
    const wasUpvoted = upvoted;
    setUpvoted(!wasUpvoted);
    setCount((c) => (wasUpvoted ? c - 1 : c + 1));
    try {
      const token = localStorage.getItem('access');
      const res = await fetch('/api/citizen/issue/' + issueId + '/upvote/', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Failed');
    } catch {
      setUpvoted(wasUpvoted);
      setCount((c) => (wasUpvoted ? c + 1 : c - 1));
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleUpvote}
      disabled={loading}
      className={[
        'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium',
        'transition-all duration-150 select-none',
        upvoted ? 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-700' : 'bg-gray-100 text-gray-600 hover:bg-indigo-50 hover:text-indigo-700',
        loading ? 'opacity-60 cursor-wait' : 'cursor-pointer',
      ].join(' ')}
    >
      <ThumbsUp className={'w-4 h-4 transition-transform ' + (upvoted ? 'scale-110' : '')} />
      <span>{count}</span>
    </button>
  );
}