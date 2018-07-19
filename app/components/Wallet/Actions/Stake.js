// @flow
import React, { Component } from 'react';
import { Input, Label, Form, Segment } from 'semantic-ui-react';
import ModalComponent from '../../Shared/Modal';

export default class Stake extends Component<Props> {
  constructor(props) {
    super(props);

    const { accounts } = this.props;

    this.state = {
      cpu: {
        used: accounts.account.self_delegated_bandwidth.cpu_weight.split(
          ' '
        )[0],
        new: accounts.account.self_delegated_bandwidth.cpu_weight.split(' ')[0]
      },
      bandwidth: {
        used: accounts.account.self_delegated_bandwidth.net_weight.split(
          ' '
        )[0],
        new: accounts.account.self_delegated_bandwidth.net_weight.split(' ')[0]
      },
      open: false,
      content: '',
      actions: [],
      changes: {
        delegate: [],
        undelegate: []
      }
    };
  }

  handleChange = (e, { name, value }) => {
    this.setState(prev => ({
      [name]: Object.assign(prev[name], { new: value })
    }));
  };

  renderModal = () => {
    const { open, content, actions } = this.state;
    return (
      <ModalComponent
        open={open}
        content={content}
        actions={actions}
        onActionClick={this.onActionClick}
      />
    );
  };

  handleSubmit = () => {
    const { accounts, actions } = this.props;
    const { cpu, bandwidth } = this.state;

    const accountName = accounts.account.account_name;
    const cpuDelta = cpu.new - cpu.used;
    const netDelta = bandwidth.new - bandwidth.used;

    const needDelegation = cpuDelta > 0 || netDelta > 0;
    const needUndelegation = cpuDelta < 0 || netDelta < 0;

    if (needDelegation) {
      const args = [
        accountName,
        accountName,
        netDelta > 0 ? netDelta : 0,
        cpuDelta > 0 ? cpuDelta : 0
      ];
      actions.delegate.apply(null, args);
    }

    if (needUndelegation) {
      const args = [
        accountName,
        accountName,
        netDelta < 0 ? Math.abs(netDelta) : 0,
        cpuDelta < 0 ? Math.abs(cpuDelta) : 0
      ];
      actions.undelegate.apply(null, args);
    }
  };

  render() {
    const { cpu, bandwidth, changes } = this.state;

    console.log(changes);

    return (
      <Segment className="no-border">
        <Form onSubmit={this.handleSubmit} className="stake">
          <Form.Group>
            <Form.Field>
              <Input
                name="cpu"
                type="text"
                value={cpu.new}
                onChange={this.handleChange}
                labelPosition="right"
              >
                <Label basic>CPU</Label>
                <input />
                <Label />
              </Input>
            </Form.Field>
            <Form.Field>
              <Input
                name="bandwidth"
                type="text"
                value={bandwidth.new}
                onChange={this.handleChange}
                labelPosition="right"
              >
                <Label basic>Bandwidth</Label>
                <input />
                <Label />
              </Input>
            </Form.Field>
          </Form.Group>
          <Form.Button className="submit" content="Submit" />
        </Form>
        {this.renderModal()}
      </Segment>
    );
  }
}
