import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import Campaign from '../ethereum/campaign';

class RequestRow extends Component {

    state={
        loadingApprove : false,
        loadingFinalize : false
        
    };
    

    onApprove = async () => {

        this.setState({loadingApprove : true});

        const campaign = Campaign(this.props.address);
        
        const accounts = await web3.eth.getAccounts();
        
        await campaign.methods.approveRequest(this.props.id).send({
            from: accounts[0]
        });

        this.setState({loadingApprove : false});

    }

    onFinalize = async () => {
        this.setState({loadingFinalize : true});

        const campaign = Campaign(this.props.address);
        
        const accounts = await web3.eth.getAccounts();
        
        await campaign.methods.finalizeRequest(this.props.id).send({
            from: accounts[0]
        });

        this.setState({loadingFinalize : false});
    }

    render() {

        const { Row, Cell} = Table;
        const {id, request, approversCount} = this.props;

        const readyToFinalize = request.approvalCount > (approversCount/2);

        return (
            <Row disabled={request.complete} positive={readyToFinalize && !request.complete}>
                <Cell>{id}</Cell>
                <Cell>{request.description}</Cell>
                <Cell>{web3.utils.fromWei(request.value, 'ether')}</Cell>
                <Cell>{request.recipient}</Cell>
                <Cell>{request.approvalCount}/{approversCount}</Cell>
                <Cell>
                   
                    <Button color="green" basic loading={this.state.loadingApprove} onClick={this.onApprove}>
                        Approve
                    </Button>
                   
                </Cell>
                <Cell>
                
                    <Button color="black" basic loading={this.state.loadingFinalize} onClick={this.onFinalize}>
                    Finalize
                </Button>
                
                
                </Cell>
                <Cell>
                    {request.complete ? 'Completed' : 'Pending'}
                </Cell>
               

            </Row>
        );
    }
}

export default RequestRow;
