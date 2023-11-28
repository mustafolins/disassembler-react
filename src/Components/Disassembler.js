import React, { Component } from 'react'
import { Button, CircularProgress } from '@mui/material'
import { styled } from '@mui/material/styles';
import SectionDetails from './SectionDetails';

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

export default class Disassembler extends Component {
    constructor(props) {
        super(props)

        // set up state variables
        this.state = {
            api: 'https://disassemblerapi.azurewebsites.net/',
            sections: [],
            isLoading: false
        }

        this.fileUpload = this.fileUpload.bind(this)
    }

    fileUpload(e) {
        console.log(e.target.files[0])
        this.setState(
            {
                isLoading: true
            })
        this.getBase64(e.target.files[0]).then(
            data => {
                let base64string = data.substring(data.indexOf(',') + 1)
                console.log(base64string);
                var requestOptions = {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    method: 'POST',
                    body: JSON.stringify(base64string)
                };

                fetch(`${this.state.api}api/disassembler/peinfo`, requestOptions)
                    .then(response => response.json())
                    .then(result => {
                        console.log(result)
                        this.setState(
                            {
                                sections: result.sections,
                                isLoading: false
                            })
                    })
                    .catch(error => {
                        console.log('error', error)
                        this.setState(
                            {
                                isLoading: false
                            })
                    });
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
                {!this.state.isLoading ?
                    <Button component='label' variant='outlined'>
                        Upload binary!
                        <VisuallyHiddenInput type='file' onChange={this.fileUpload} />
                    </Button> : null
                }

                {this.state.isLoading ?
                    <CircularProgress /> : null
                }

                {this.state.sections.map((sectionInfo, i) =>
                    <SectionDetails key={`accordian-${i}`} sectionInfo={sectionInfo} sectionIndex={i} />
                )}
            </div>
        )
    }
}
