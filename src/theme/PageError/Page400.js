import React from "react";
import PageError from "./PageError";
import {withTranslation} from "react-i18next";

class Page400 extends React.Component {
    // constructor(props) {
    //     super(props);
    // }

    render() {
        return <PageError code={400} goToHome={true} title={this.props.t("error.p400.title")} />;
    }

}

export default withTranslation()(Page400);