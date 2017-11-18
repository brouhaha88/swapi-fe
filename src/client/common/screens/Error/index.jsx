import React from 'react';
import { connect } from 'react-redux';
import qs from 'qs';
import Box from 'grommet/components/Box';
import Headline from 'grommet/components/Headline';
import Section from 'grommet/components/Section';

class Error extends React.Component {
  render() {
    const {
      path: notFoundPath,
    } = qs.parse(this.props.router.location.search, { ignoreQueryPrefix: true });

    return (
      <Section>
        <Box align="center">
          <Headline align="center">
            {`Oops! We cannot find "${notFoundPath || ''}"`}
          </Headline>
        </Box>
      </Section>
    );
  }
}

const mapStateToProps = ({ router }) => ({ router });

export default connect(mapStateToProps, () => ({}))(Error);
