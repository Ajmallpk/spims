// /**
//  * LoginInput
//  * Props:
//  *  - id: string
//  *  - label: string
//  *  - type: string
//  *  - value: string
//  *  - onChange: (e) => void
//  *  - placeholder: string
//  *  - disabled: boolean
//  *  - icon: LucideIcon component (optional)
//  *  - rightElement: ReactNode (optional, e.g. eye toggle)
//  *  - autoComplete: string
//  */
// const LoginInput = ({
//   id,
//   label,
//   type = "text",
//   value,
//   onChange,
//   placeholder,
//   disabled = false,
//   icon: Icon,
//   rightElement,
//   autoComplete,
// }) => {
//   return (
//     <div className="space-y-1.5">
//       <label
//         htmlFor={id}
//         className="block text-sm font-semibold text-gray-700"
//       >
//         {label}
//       </label>
//       <div className="relative">
//         {Icon && (
//           <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
//             <Icon size={16} />
//           </span>
//         )}
//         <input
//           id={id}
//           type={type}
//           value={value}
//           onChange={onChange}
//           placeholder={placeholder}
//           disabled={disabled}
//           autoComplete={autoComplete}
//           className={`w-full ${Icon ? "pl-9" : "pl-3.5"} ${
//             rightElement ? "pr-10" : "pr-3.5"
//           } py-2.5 text-sm rounded-lg border border-gray-300 bg-white text-gray-800 placeholder-gray-400
//             focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
//             disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
//             transition-all duration-150`}
//         />
//         {rightElement && (
//           <span className="absolute right-3 top-1/2 -translate-y-1/2">
//             {rightElement}
//           </span>
//         )}
//       </div>
//     </div>
//   );
// };

// export default LoginInput;







/**
 * LoginInput
 * Props:
 *  - id: string
 *  - label: string
 *  - type: string
 *  - value: string
 *  - onChange: (e) => void
 *  - placeholder: string
 *  - disabled: boolean
 *  - icon: LucideIcon component (optional)
 *  - rightElement: ReactNode (optional, e.g. eye toggle)
 *  - autoComplete: string
 */
const LoginInput = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled = false,
  icon: Icon,
  rightElement,
  autoComplete,
}) => {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-xs font-semibold text-white uppercase tracking-wide"
      >
        {label}
      </label>
      <div className="relative group">
        {Icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors duration-200 pointer-events-none">
            <Icon size={17} strokeWidth={2} />
          </span>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          className={`w-full ${Icon ? "pl-11" : "pl-4"} ${
            rightElement ? "pr-11" : "pr-4"
          } py-3 text-sm rounded-xl border border-slate-200 bg-slate-800 text-white placeholder-slate-400
            focus:outline-none focus:ring-4 focus:ring-emerald-600/10 focus:border-emerald-600 focus:bg-slate-800
            disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed
            transition-all duration-200`}
        />
        {rightElement && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2">
            {rightElement}
          </span>
        )}
      </div>
    </div>
  );
};

export default LoginInput;