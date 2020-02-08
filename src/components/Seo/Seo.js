import React from 'react';
import Helmet from 'react-helmet';
import config from '../../../content/meta/config';

const Seo = props => {
  const { data, facebook, description, title } = props;
  const postTitle = ((data || {}).frontmatter || {}).title;
  const postDescription = ((data || {}).frontmatter || {}).description;
  const postCover = ((data || {}).frontmatter || {}).cover;
  const postSlug = ((data || {}).fields || {}).slug;

  const usedTitle = title
    ? title
    : postTitle
      ? `${postTitle} - ${config.shortSiteTitle}`
      : config.siteTitle;
  const usedDescription = postDescription
    ? postDescription
    : description
      ? description
      : config.siteDescription;
  const image = postCover ? postCover : config.siteImage;
  const url = config.siteUrl + config.pathPrefix + postSlug;

  return (
    <>
      <Helmet
        htmlAttributes={{
          lang: config.siteLanguage,
          prefix: 'og: http://ogp.me/ns#',
        }}
      >
        {/* General tags */}
        <title>{title}</title>
        <meta name="description" content={usedDescription} />
        {/* OpenGraph tags */}
        <meta property="og:url" content={url} />
        <meta property="og:title" content={usedTitle} />
        <meta property="og:description" content={usedDescription} />
        <meta property="og:image" content={image} />
        <meta property="og:type" content="website" />
        <meta
          name="google-site-verification"
          content="MXUQmmnRvuWRzx7IMgocc8oVLeoW1KAe_R6rvFmvIEc"
        />
        {facebook ? <meta property="fb:app_id" content={facebook.appId} /> : null}
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:creator"
          content={config.authorTwitterAccount ? config.authorTwitterAccount : ''}
        />
      </Helmet>
    </>
  );
};

export default Seo;
