import React, { useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

import { 
    Button, Segment, Image, Container, Message, Loader, 
    Table, Header, Dropdown } 
    from 'semantic-ui-react';

const CharacterList = () => {
    const navigate = useNavigate();

    const { state, dispatch } = useContext(AppContext); 
    const { listResponse, prevPage, nextPage, numPages, url, page, statusFilter } = state;
    
    useEffect(() => {
        axios.get(url, { params: {page: page, status: statusFilter}}).then((res) => {
            const data = res.data;
            dispatch({type: 'LIST_RESPONSE_SUCCESS', payload: {
                listResponse: data.results,
                prevPage: data.info.prev,
                nextPage: data.info.next,
                numPages: data.info.pages,
            }});
        }).catch((err) => {
            console.error(err);
            dispatch({type: 'LIST_RESPONSE_ERROR', payload: {
                error: err,
            }});
        });
    }, [url, page, statusFilter]);

    const statusOptions = [
        {
            key: 'All',
            text: 'All',
            value: 'All',
            label: { color: 'grey', empty: true, circular: true} ,
        },
        {
            key: 'Alive',
            text: 'Alive',
            value: 'Alive',
            label: { color: 'green', empty: true, circular: true },
        },
        {
            key: 'Dead',
            text: 'Dead',
            value: 'Dead',
            label: { color: 'red', empty: true, circular: true },
        },
        {
            key: 'Unknown',
            text: 'Unknown',
            value: 'Unknown',
            label: { color: 'yellow', empty: true, circular: true },
        },
    ];

    const setUrl = (newUrl) => {
        dispatch({type: 'SET_URL', payload: {
            url: newUrl,
        }});
    };

    const setFilter = (status) => {
        dispatch({type: 'SET_QUERY_ARGS', payload: {
            page: 1,
            statusFilter: status,
        }});
    };

    const setPage = (page) => {
        dispatch({type: 'SET_PAGE', payload: {
            page: page,
        }});
    }

    const getCellForStatus = (status) => {
        if (status === 'Alive') {
            return <Table.Cell positive>{status}</Table.Cell>
        } else if (status === 'Dead') {
            return <Table.Cell negative>{status}</Table.Cell>
        } else {
            return <Table.Cell warning>{status}</Table.Cell>
        }
    };

    if (!listResponse) {
        return <Container text>
                    <Segment raised padded='very'>
                        <Header as='h2'>Rick and Morty characters</Header> 
                        <Loader active inline='centered'/>
                    </Segment>
                </Container>;

    }

    if (listResponse.error) {
        return <Container text>
                <Segment raised padded='very'>
                    <Header as='h2'>Rick and Morty characters</Header>
                    <Message negative>Couldn't fetch characters.</Message>
                </Segment>
             </Container>;
    }

    //name status species gender image 
    return <Container text>
        <Segment raised padded='very'>
        <Header as='h2'>Rick and Morty characters</Header>
        <Table celled selectable>
            <Table.Header>
                <Table.Row textAlign='center'>
                    <Table.HeaderCell>Image</Table.HeaderCell>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>
                        Filter Status by {' '}
                        <Dropdown
                        inline
                        options={statusOptions}
                        defaultValue={statusOptions[0].value}
                        onChange={(e) => {setFilter(e.target.innerText);}}
                        />
                    </Table.HeaderCell>
                    <Table.HeaderCell>Species</Table.HeaderCell>
                    <Table.HeaderCell>Gender</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
            {listResponse.map((character) => {
                return <Table.Row textAlign='center' key={character.id} onClick={() => navigate(`/character/${character.id}`)}>
                    <Table.Cell><Image src={character.image} alt={character.name} size='small' circular ui></Image></Table.Cell>
                    <Table.Cell>{character.name}</Table.Cell>
                    {getCellForStatus(character.status)}
                    <Table.Cell>{character.species}</Table.Cell>
                    <Table.Cell>{character.gender}</Table.Cell>
                </Table.Row>
            })}
            </Table.Body>
        </Table>
        <h2>Page: {page} / {numPages}</h2>
        <Button disabled={page === 1} onClick={() => {setPage(1);}}>First</Button>
        <Button disabled={prevPage === null} onClick={() => {setUrl(prevPage)}}>Previous</Button>
        <Button disabled={nextPage === null} onClick={() => {setUrl(nextPage)}}>Next</Button>
        <Button disabled={page === numPages} onClick={() => {setPage(numPages)}}>Last</Button>
    </Segment>;
    </Container>
}

export default CharacterList;