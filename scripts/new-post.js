#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

function toSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

async function main() {
  const title = (await ask('Post title: ')).trim();
  rl.close();

  if (!title) {
    console.error('Title is required.');
    process.exit(1);
  }

  const slug = toSlug(title);
  const date = new Date().toISOString();
  const dir = path.join(__dirname, '..', 'src', 'pages', 'posts', slug);

  if (fs.existsSync(dir)) {
    console.error(`Directory already exists: ${dir}`);
    process.exit(1);
  }

  fs.mkdirSync(dir, { recursive: true });

  fs.writeFileSync(
    path.join(dir, 'index.mdx'),
    `---
title: ${title}
description:

date: '${date}'
ogImage:
  title: ${title}
readingTime:
tags: []
---

{/* !start-of-preview */}

{/* !end-of-preview */}
`,
  );

  fs.writeFileSync(
    path.join(dir, 'index.tsx'),
    `import { GetStaticProps } from 'next/types';

import { getPostBySlug } from '@/blog/getPosts';
import { Post as PostType } from '@/blog/types';
import Post from '@/components/Blog/Post/Post';

type Props = {
  post: PostType;
};

const PostPage = ({ post }: Props) => {
  return <Post post={post} />;
};

export default PostPage;

export const getStaticProps: GetStaticProps<Props> = async () => {
  return {
    props: {
      post: await getPostBySlug('${slug}'),
    },
  };
};
`,
  );

  console.log(`\nCreated post at src/pages/posts/${slug}/`);
  console.log(`  - index.mdx`);
  console.log(`  - index.tsx`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
