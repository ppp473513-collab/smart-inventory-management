function Loader({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />

      <p className="mt-3 text-sm text-slate-500">
        {text}
      </p>
    </div>
  );
}

export default Loader;