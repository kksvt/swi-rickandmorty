import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const CharacterDetails = () => {
    const url = process.env.REACT_APP_RNM_CHAR_URL;
    const { id } = useParams();
    const [ response, setResponse ] = useState(null);

    useEffect(() => {
        axios.get(`${url}/${id}`, {}).then((res) => {
            setResponse(res.data);
        }).catch((err) => {
            console.error(err);
            setResponse({error: err});
        });
    }, []);

    if (!response) {
        return <h3>Loading character...</h3>;
    }

    if (response.error) {
        return <h3>Error fetching character {id}</h3>;
    }

    return <div>Ok</div>;
};

export default CharacterDetails;