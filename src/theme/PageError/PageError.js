import React from "react";
import * as links from "../../constants/links";
import i18n from "../../i18n";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import {Typography} from "antd";

class PageError extends React.Component {

    render() {
        return (
            <div style={{textAlign: 'center'}}>
                {this.props.code && <Typography variant="h1" style={{fontWeight: 700, marginBottom: '1rem', fontSize: '8rem'}}>{this.props.code}</Typography>}
                {this.props.title &&  <Typography variant="h2" style={{marginBottom: '1rem'}}>{this.props.title}</Typography>}
                {this.props.goToHome && <Typography variant="caption" style={{fontSize: '1rem'}}>
                    <Link href={"#"} onClick={(e) => {
                        e.preventDefault();
                        if (typeof this.props.resetErrorBoundary === 'function') {
                            this.props.resetErrorBoundary();
                        }
                        window.location.replace(links.HOME);
                    }}>{i18n.t("label.goToHome")}</Link>
                </Typography>}
            </div>
        );
    }
}

PageError.propTypes = {
    title: PropTypes.string.isRequired,
};
export default PageError;
