// citizen/pages/Home.jsx
import { useState, useEffect } from 'react';
import IssueCard from '@/components/citizen/IssueCard';
import PostIssueButton from '@/components/citizen/PostissueButton';

export default function Home() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const token = localStorage.getItem('access');
        const res = await fetch('/api/citizen/issues/feed/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch feed');
        const data = await res.json();
        setIssues(data.results || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, []);

  if (loading) {
    return (
      <div className='space-y-4'>
        {[1, 2, 3].map((i) => (
          <div key={i} className='bg-white rounded-xl shadow-md p-5 animate-pulse'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='w-10 h-10 bg-gray-200 rounded-full' />
              <div className='space-y-1.5 flex-1'>
                <div className='h-3.5 bg-gray-200 rounded w-32' />
                <div className='h-3 bg-gray-100 rounded w-20' />
              </div>
            </div>
            <div className='space-y-2'>
              <div className='h-4 bg-gray-200 rounded w-3/4' />
              <div className='h-3 bg-gray-100 rounded w-full' />
            </div>
            <div className='h-44 bg-gray-100 rounded-xl mt-4' />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className='bg-white rounded-xl shadow-md p-8 text-center'>
        <p className='text-gray-700 font-medium'>Could not load feed</p>
        <p className='text-sm text-gray-400 mt-1'>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className='mt-4 px-4 py-2 bg-indigo-600 text-white text-sm rounded-xl hover:bg-indigo-700 transition-colors'
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className='space-y-4 pb-24'>
      <div className='bg-white rounded-xl shadow-md px-5 py-4 flex items-center justify-between'>
        <div>
          <h1 className='text-base font-bold text-gray-900'>Community Feed</h1>
          <p className='text-xs text-gray-400 mt-0.5'>
            {issues.length} issue{issues.length !== 1 ? 's' : ''} reported in your area
          </p>
        </div>
        <div className='flex gap-2'>
          <button className='text-xs px-3 py-1.5 bg-indigo-50 text-indigo-700 font-medium rounded-lg hover:bg-indigo-100 transition-colors'>
            Latest
          </button>
          <button className='text-xs px-3 py-1.5 bg-gray-100 text-gray-600 font-medium rounded-lg hover:bg-gray-200 transition-colors'>
            Top
          </button>
        </div>
      </div>
      {issues.length === 0 ? (
        <div className='bg-white rounded-xl shadow-md p-10 text-center'>
          <p className='text-gray-500 text-sm'>No issues reported yet in your area.</p>
        </div>
      ) : (
        issues.map((issue) => (
          <IssueCard key={issue.id} issue={issue} />
        ))
      )}
      <PostIssueButton />
    </div>
  );
}