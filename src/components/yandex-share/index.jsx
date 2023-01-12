import React, {PureComponent} from 'react';
import {string} from 'prop-types';

import {getYandexShareParams} from './yandex-share-settings';

import './yandex-share.scss';

class YaShare extends PureComponent {

    static propTypes = {
        url: string
    }

	constructor(props) {
		super(props);
		this.catcherRef = React.createRef();
	}

	componentDidMount() {
		if (typeof window.Ya === 'undefined' || typeof window.Ya.share2 === 'undefined') {
			const shareScript = document.createElement("script");

			shareScript.src = "https://yastatic.net/share2/share.js";
			shareScript.async = true;
			shareScript.onload = () => this.setYaShareParams();

			document.body.appendChild(shareScript);
		} else {
			this.setYaShareParams();
		}
	};

	componentWillUnmount() {
		if (typeof this.share === 'object') {
			this.share.destroy();
		}
	}

	setYaShareParams = () => {
	    const {url} = this.props;
		if (window.Ya && window.Ya.share2) {
			this.share = window.Ya.share2(this.catcherRef.current, getYandexShareParams(url));
		}
	};

	render() {
		return (
			<div className="yandex-share">
				<div
					ref={this.catcherRef}
					className="yandex-share__catcher"
				/>
			</div>
		)
	}
}

export default YaShare;
