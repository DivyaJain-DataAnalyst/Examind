function Logo({ className = "" }) {
    return (
        <h1 className={`font-bold text-slate-950 ${className}`}>
            Exam<span className="text-sky-600">Ind</span>
        </h1>
    );
}

export default Logo;
