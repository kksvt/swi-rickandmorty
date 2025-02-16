import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { 
    Container, Segment, Header, Loader, Message,
    Card, Image, Label, List, Grid, Pagination
 } from 'semantic-ui-react';

 import { AppContext } from '../context/AppContext';

const CharacterDetails = () => {
    const epPerPage = 9;

    const { state, dispatch } = useContext(AppContext); 
    const { defaultCharacterUrl, defaultEpisodeUrl, episodeData } = state;

    const { id } = useParams();
    const [ response, setResponse ] = useState(null);
    const [ activePage, setActivePage ] = useState(1);

    const episodeUrlToId = (episode) => {
        const getId = episode.split(`${defaultEpisodeUrl}/`);
        if (getId.length < 2) {
            console.err(`Couldn't retrieve id from episode ${episode}.`);
            return null;
        }
        return getId[1];
    };

    useEffect(() => {
        axios.get(`${defaultCharacterUrl}/${id}`, {}).then((res) => {
            setResponse(res.data);
            let episodeRequests = [];
            res.data.episode.map(episode => {
                return episodeUrlToId(episode);
            }).forEach(episode => {
                if (episode && !episodeData[episode]) {
                    episodeRequests.push(episode);
                }
            });
            if (episodeRequests.length > 0) {
                axios.get(`${defaultEpisodeUrl}/${episodeRequests}`, {}).then((res) => {
                    dispatch({type: 'SET_EPISODE_DATA', payload: {
                        episodeData: episodeRequests.length === 1 ? [res.data] : res.data,
                    }});
                }).catch((err) => {
                    console.error(err);
                });
            }
        }).catch((err) => {
            console.error(err);
            setResponse({error: err});
        });
    });

    const parseStatus = (status) => {
        switch (status) {
            case 'Alive':
                return <Label circular color='green'>{status}</Label>
            case 'Dead':
                return <Label circular color='red'>{status}</Label>
            default:
                return <Label circular color='yellow'>{status}</Label>
        }
    };

    const parseSpeciesAndtype = (species, type) => {
        if (!type || !type.length) {
            return <span>{species}</span>;
        }

        return <span>{species} - {type}</span>;
    };

    if (!response) {
        return <Container text>
                    <Segment raised padded='very'>
                        <Header as='h2'>Rick and Morty characters</Header> 
                        <Loader active inline='centered'/>
                    </Segment>
                </Container>;
    }

    if (response.error) {
        return <Container text>
                <Segment raised padded='very'>
                    <Header as='h2'>Rick and Morty characters</Header>
                    <Message negative>Couldn't fetch character {id}.</Message>
                </Segment>
             </Container>;
    }

    return <Container text textAlign='center'>
                <Segment raised padded='very'>
                    <Header as='h2'>Rick and Morty characters</Header>
                    <Card.Group>
                        <Card>
                            <Image src={response.image} rounded/>
                            <Card.Content>
                                <Card.Header>{response.name}</Card.Header>
                                <Card.Meta>
                                    {parseSpeciesAndtype(response.species, response.type)}
                                </Card.Meta>
                                <Card.Description>
                                    <List>
                                        <List.Item>
                                            <List.Content>
                                                <List.Header>Status</List.Header>
                                                <List.Description>{parseStatus(response.status)}</List.Description>
                                            </List.Content>
                                        </List.Item>
                                        <List.Item>
                                            <List.Content>
                                                <List.Header>Gender</List.Header>
                                                <List.Description>{response.gender}</List.Description>
                                            </List.Content>
                                        </List.Item>
                                        <List.Item>
                                            <List.Content>
                                                <List.Header>Origin</List.Header>
                                                <List.Description>{response.origin.name}</List.Description>
                                            </List.Content>
                                        </List.Item>
                                        <List.Item>
                                            <List.Content>
                                                <List.Header>Location</List.Header>
                                                <List.Description>{response.location.name}</List.Description>
                                            </List.Content>
                                        </List.Item>
                                    </List>
                                </Card.Description>
                            </Card.Content>
                        </Card>
                        <Card>
                            <Card.Content>
                                <Grid columns={1} divided style={{height: '60vh'}}>
                                    <Grid.Row>
                                        <Grid.Column>
                                            <Header as='h3'>Appearances</Header>
                                            <List>
                                                {response.episode.slice((activePage - 1) * epPerPage, (activePage - 1) * epPerPage + epPerPage ).map((ep, index) => {
                                                    const id = episodeUrlToId(ep);
                                                    if (id && episodeData[id]) {
                                                        return <List.Item key={index}>
                                                            <List.Content>
                                                                <List.Header>{episodeData[id].episode}</List.Header>
                                                                <List.Description style={{ wordWrap: 'break-word'}}>{episodeData[id].name}</List.Description>
                                                            </List.Content>
                                                        </List.Item>;
                                                    }
                                                    return <List.Item key={index}>
                                                        <List.Content>
                                                            <List.Header>Episode</List.Header>
                                                            <List.Description style={{wordWrap: 'break-word'}}>???</List.Description>
                                                        </List.Content>
                                                    </List.Item>
                                                })}
                                            </List>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row verticalAlign='bottom'>
                                        <Grid.Column>
                                            <Pagination
                                                inline='centered'
                                                defaultActivePage={activePage} 
                                                totalPages={Math.ceil(response.episode.length / epPerPage)} 
                                                onPageChange={(_, { activePage } ) => { setActivePage(activePage);}}
                                                siblingRange={1} 
                                                boundaryRange={0}
                                                firstItem={null}
                                                lastItem={null}
                                                ellipsisItem={null}
                                        />
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Card.Content>
                        </Card>
                    </Card.Group>
                </Segment>
            </Container>
};

export default CharacterDetails;