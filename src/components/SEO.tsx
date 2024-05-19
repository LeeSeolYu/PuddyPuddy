import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
}

function SEO({ title, description }: SEOProps) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta
        property="og:image"
        content="https://github.com/LeeSeolYu/PuddyPuddy/raw/main/public/images/puddypuddy_logo.png"
      />
      <meta property="og:image:width" content="260" />
      <meta property="og:image:height" content="260" />
      <meta property="og:description" content={description} />
      <meta property="og:locale" content="ko_KR" />
    </Helmet>
  );
}

export default SEO;
