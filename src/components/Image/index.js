import React, { Component } from 'react';

const transparentImage = `data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==`;

class Image extends Component {
  state = {
    loading: true,
    opacity: 1,
  };

  componentDidMount() {
    this.dummy = new window.Image();
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.3,
    };

    this.observer = new IntersectionObserver(this.handleImageLoad, options);

    this.observer.observe(this.image);
  }

  setImageRef = e => {
    this.image = e;
  };

  handleImageLoad = entries => {
    const isIntersecting = entries && entries[0] && entries[0].isIntersecting;

    if (isIntersecting && this.state.loading) {
      this.dummy.src = this.props.src;
      this.dummy.onload = () => {
        this.setState({ opacity: 0.1 });
        setTimeout(() => {
          this.setState({ opacity: 1, loading: false });
        }, 200);
      };
    }
  };

  render() {
    const { loading, opacity } = this.state;
    const { alt, className, width, height, src, style, ...rest } = this.props;
    const finalStyle = {
      width: width || '100%',
      height: height || 'auto',
      transition: '.2s ease-in-out',
      background: 'linear-gradient(112deg, #aaaaaa, #cacaca)',
      opacity,
      ...style,
    };
    const source = loading ? transparentImage : src;

    return (
      <img
        ref={this.setImageRef}
        className={className}
        style={finalStyle}
        src={source}
        alt={alt}
        {...rest}
      />
    );
  }
}

export default Image;
