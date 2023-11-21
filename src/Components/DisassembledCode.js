import { Button, Typography } from '@mui/material'
import { styled } from '@mui/material/styles';
import React, { Component } from 'react'

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export default class DisassembledCode extends Component {
    constructor(props) {
        super(props)

        // set up state variables
        this.state = {
            api: 'https://disassemblerapi.azurewebsites.net/',
            opCodes: []
        }

        this.fileUpload = this.fileUpload.bind(this)
    }

    fileUpload(e) {
        console.log(e.target.files[0])
        this.getBase64(e.target.files[0]).then(
            data => {
                let base64string = data.substring(data.indexOf(',') + 1)
                console.log(base64string);
                var requestOptions = {
                    method: 'POST',
                    body: JSON.stringify(base64string),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    redirect: 'follow'
                };

                fetch(`${this.state.api}api/disassembler/assembly`, requestOptions)
                    .then(response => response.json())
                    .then(result => {
                        console.log(result)
                        this.setState({opCodes: result})
                    })
                    .catch(error => console.log('error', error));
            }
        )
    }

    getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                resolve(reader.result);
            }
            reader.onerror = error => reject(error);
        });
    }

    render() {
        return (
            <div>
                <Button component='label' variant='outlined'>
                    Upload binary!
                    <VisuallyHiddenInput type='file' onChange={this.fileUpload} />
                </Button>

                {this.state.opCodes.map((opCode, index) => 
                    <Typography key={index}>
                        {opCode}
                    </Typography>
                )}
            </div>
        )
    }
}
