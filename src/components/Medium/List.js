import React from 'react';
import MediumPostCard from './PostCard';
import { ThemeContext } from '../../layouts';

const MediumList = () => {
  return (
    <ThemeContext.Consumer>
      {theme => (
        <React.Fragment>
          <section>
            <MediumPostCard
              title="Building 60 FPS QR Scanner for the Mobile Web"
              coverImage="https://miro.medium.com/max/600/1*o-1FRXCv8hwsN5IMYRxo3Q.jpeg?q=75"
              excerpt="Nowadays, web-apps are expected to be more and more powerful. Since the conception of AJAX, the web is no longer a medium to simply view..."
              url="https://medium.com/tokopedia-engineering/building-60-fps-qr-scanner-for-the-mobile-web-eb0deddce099?source=friends_link&sk=cf7e9918b4475b7c1f54ba1dc3da5ba0"
              timeToRead="6 min read"
            />
            <MediumPostCard
              title="Writing Your Own Changelog Generator with Git"
              coverImage="https://miro.medium.com/max/600/0*s1Kr_0A-w5ZCES9A?q=75"
              excerpt="Turn your commit messages into release notes for your users."
              url="https://medium.com/better-programming/create-your-own-changelog-generator-with-git-aefda291ea93?source=friends_link&sk=947e8881412f1d4e9cd20e4e8d42666b"
              timeToRead="8 min read"
            />
            <MediumPostCard
              title="WebAssembly — Is It As Scary As It Sounds?"
              coverImage="https://miro.medium.com/max/600/1*KoFqaWev5QQ_CjhzAojv4g.png?q=75"
              excerpt="Learn WebAssembly while building a Wasm-based QR decoder for the browser."
              url="https://medium.com/better-programming/webassembly-is-it-as-scary-as-it-sounds-b0c38fb2d9c8?source=friends_link&sk=43c038ba1edc4dceafbcd8b394654562"
              timeToRead="10 min read"
            />
            <MediumPostCard
              title="Achieving 90+ Mobile Web Performance at Tokopedia"
              coverImage="https://miro.medium.com/max/600/1*iutJ4V6Jl9CmLMy5zFcoAA.jpeg?q=75"
              excerpt="The story of how we managed to achieve the elusive green-performance-score for our mobile web, while being interactive in 4 seconds."
              url="https://medium.com/tokopedia-engineering/achieving-90-mobile-web-performance-at-tokopedia-23f557d98d5?source=friends_link&sk=60ab3737d2bf5ad764dc14bdd5e8da19"
              timeToRead="6 min read"
            />
          </section>

          <style jsx>{`
            section {
              display: block;
              padding: 0 ${theme.space.s};
              white-space: nowrap;
              overflow-x: scroll;
              scroll-snap-type: x mandatory;
              vertical-align: top;
            }
          `}</style>
        </React.Fragment>
      )}
    </ThemeContext.Consumer>
  );
};

export default MediumList;
