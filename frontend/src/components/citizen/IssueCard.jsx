// citizen/components/IssueCard.jsx
import { MapPin, Clock } from 'lucide-react';
import StatusBadge from '@/components/citizen/StatusBadge';
import UpvoteButton from '@/components/citizen/UpvoteButton';
import CommentSection from '@/components/citizen/CommentSection';
import ResolvedRepost from '@/components/citizen/ResolvedRepost';

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return mins + 'm ago';
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs + 'h ago';
  const days = Math.floor(hrs / 24);
  if (days < 7) return days + 'd ago';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export default function IssueCard({ issue }) {
  const {
    id, citizen_name, ward, created_at, title,
    description, image, status, upvote_count,
    user_upvoted, comments, resolution,
  } = issue;

  const initials = (citizen_name || 'C')
    .split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <article className='bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200'>
      <div className='p-5'>
        <div className='flex items-start justify-between gap-3 mb-3'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm flex-shrink-0'>
              {initials}
            </div>
            <div>
              <p className='text-sm font-semibold text-gray-900 leading-tight'>
                {citizen_name || 'Anonymous Citizen'}
              </p>
              <div className='flex items-center gap-2 mt-0.5 flex-wrap'>
                {ward && (
                  <span className='flex items-center gap-0.5 text-[11px] text-gray-500'>
                    <MapPin className='w-3 h-3' />{ward}
                  </span>
                )}
                <span className='flex items-center gap-0.5 text-[11px] text-gray-400'>
                  <Clock className='w-3 h-3' />{timeAgo(created_at)}
                </span>
              </div>
            </div>
          </div>
          <StatusBadge status={status} />
        </div>

        <h2 className='text-base font-bold text-gray-900 mb-1.5 leading-snug'>{title}</h2>

        {description && (
          <p className='text-sm text-gray-600 leading-relaxed line-clamp-3 mb-3'>{description}</p>
        )}

        {image && (
          <div className='rounded-xl overflow-hidden border border-gray-100 mb-4'>
            <img src={image} alt={title} className='w-full max-h-64 object-cover' loading='lazy' />
          </div>
        )}

        <div className='flex items-center gap-3 mt-1'>
          <UpvoteButton issueId={id} initialCount={upvote_count || 0} initialUpvoted={user_upvoted || false} />
          <span className='text-xs text-gray-400'>
            {(comments || []).length} comment{(comments || []).length !== 1 ? 's' : ''}
          </span>
        </div>

        {status === 'resolved' && resolution && (
          <ResolvedRepost resolution={resolution} />
        )}

        <CommentSection issueId={id} initialComments={comments || []} />
      </div>
    </article>
  );
}