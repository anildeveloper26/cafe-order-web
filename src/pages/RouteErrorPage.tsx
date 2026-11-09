import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom';
import { Button, buttonClasses } from '@/components/ui';
import { PATHS } from '@/routes/paths';

/** Router-level error boundary: render crashes, failed lazy chunks (after a deploy), bad responses. */
export default function RouteErrorPage() {
  const error = useRouteError();
  const isChunkError = error instanceof Error && /dynamically imported module|Loading chunk/i.test(error.message);
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : isChunkError
      ? 'A new version of the app is available.'
      : 'Something went wrong while showing this page.';

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center" role="alert">
      <p className="text-6xl">😵</p>
      <h1 className="mt-4 text-2xl font-bold text-stone-900">Oops</h1>
      <p className="mt-1 text-stone-500">{message}</p>
      <div className="mt-6 flex gap-2">
        <Button onClick={() => window.location.reload()}>Reload</Button>
        <Link to={PATHS.menu} className={buttonClasses('outline')}>
          Go to menu
        </Link>
      </div>
    </div>
  );
}
