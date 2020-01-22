import React, { Component } from 'react';

const transparentImage = `data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==`;
const loadedImageMap = {};

class Image extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: !loadedImageMap[props.src],
    };
  }

  componentDidMount() {
    const { loading } = this.state;

    if (loading) {
      this.dummy = new window.Image();
      const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3,
      };

      this.observer = new IntersectionObserver(this.handleImageLoad, options);

      this.observer.observe(this.image);
    }
  }

  setImageRef = e => {
    this.image = e;
  };

  handleImageLoad = entries => {
    const { src } = this.props;
    const isIntersecting = entries && entries[0] && entries[0].isIntersecting;

    if (isIntersecting && this.state.loading) {
      this.dummy.src = src;
      this.dummy.onload = () => {
        this.image.style.opacity = 0.1;

        loadedImageMap[src] = true;

        setTimeout(() => {
          this.setState({ loading: false }, () => {
            this.image.style.opacity = 1;
          });
        }, 200);
      };
    }
  };

  render() {
    const { loading } = this.state;
    const { alt, className, width, height, src, style, ...rest } = this.props;
    const finalStyle = {
      width: width || '100%',
      height: height || 'auto',
      transition: '.2s ease-out',
      background: 'linear-gradient(112deg, #dadada, #eaeaea)',
      ...style,
    };
    const source = loading ? transparentImage : src;

    return (
      <>
        <img
          ref={this.setImageRef}
          className={className}
          style={finalStyle}
          src={source}
          alt={alt}
          {...rest}
        />
        <style jsx>{`
          img {
            filter: var(--imageFilter);
          }
        `}</style>
      </>
    );
  }
}

export default Image;
