interface Props {
  seoTitle: string;
  seoDescription: string;
}

export default function Metadata({ seoTitle, seoDescription }: Props) {
  return (
    <>
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />

      {/* Favicon 설정 */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />

      {/* 다크모드 지원을 위한 색상 테마 메타태그 */}
      <meta
        name="theme-color"
        content="#000000"
        media="(prefers-color-scheme: dark)"
      />
      <meta
        name="theme-color"
        content="#ffffff"
        media="(prefers-color-scheme: light)"
      />

      {/* 다크모드 초기화 스크립트 */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              const theme = localStorage.getItem('theme') || 
                           (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
              document.documentElement.classList.toggle('dark', theme === 'dark');
            })();
          `,
        }}
      />
    </>
  );
}
