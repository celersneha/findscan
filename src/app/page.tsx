import Chart from "../components/Chart";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            FindScan - Technical Analysis Platform
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Advanced charting with Bollinger Bands indicators
          </p>
        </header>

        {/* Main Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <Chart width={1200} height={700} />
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Built with Next.js, TypeScript, and KLineCharts</p>
        </footer>
      </div>
    </div>
  );
}
