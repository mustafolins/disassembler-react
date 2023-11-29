import React, { Component } from 'react'
import { Alert, Box, Button, CircularProgress, Snackbar } from '@mui/material'
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
            isLoading: false,
            fileName: null
        }

        this.fileUpload = this.fileUpload.bind(this)
        this.handleCloseNotification = this.handleCloseNotification.bind(this)
    }

    /**
     * Uploads a file to the DisassemblerAPI.
     * @param {*} e The event that contains the selected file if any.
     */
    fileUpload(e) {
        console.log(e.target.files[0])
        this.setLoadingState(true);
        this.getBase64(e.target.files[0]).then(
            data => {
                // get a substring since getBase64 returns a data url
                let base64string = data.substring(data.indexOf(',') + 1)
                console.log(base64string);

                // fetch the PE info from the API
                fetch(`${this.state.api}api/disassembler/peinfo`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        method: 'POST',
                        body: JSON.stringify(base64string)
                    })
                    .then(response => response.json())
                    .then(result => {
                        console.log(result)
                        // set api response to sections state
                        this.setState(
                            {
                                sections: result.sections,
                                isLoading: false,
                                fileName: e.target.files[0].name
                            })
                    })
                    .catch(error => {
                        console.log('API error:', error)
                        this.setLoadingState();
                    });
            }
        ).catch(error => {
            console.log('Error getting base64 string of executable:', error)
            this.setLoadingState();
        })
    }

    /**
     * Gets a base64 data URL for the given file.
     * @param {*} file The file to get a base64 data URL for.
     * @returns A Promise to return the data URL for the given file.
     */
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

    /**
     * Sets the loading state of this component indicating whether or not to display progress wheel.
     * @param {*} loading Value indicationg whether or not the API is currently disassebmling the given file.
     */
    setLoadingState(loading = false) {
        this.setState(
            {
                isLoading: loading
            });
    }

    /**
     * Handles the onClose event for the SnackBar.
     */
    handleCloseNotification() {
        this.setState({
            fileName: null
        })
    }

    render() {
        return (
            <div>
                <Snackbar open={this.state.fileName !== null} autoHideDuration={3000} onClose={this.handleCloseNotification} anchorOrigin={{horizontal: 'center', vertical: 'top'}}>
                    <Alert severity='success'>Disassembled file {this.state.fileName}</Alert>
                </Snackbar>

                <Box sx={{ position: 'relative' }}>
                    <Button component='label' variant='outlined' disabled={this.state.isLoading}>
                        Upload binary!
                        <VisuallyHiddenInput type='file' onChange={this.fileUpload} />
                    </Button>

                    {this.state.isLoading ?
                        <CircularProgress size={24} sx={{ position: 'absolute', top: '50%', left: '50%', marginTop: '-12px', marginLeft: '-12px' }} /> : null
                    }
                </Box>

                {this.state.sections.map((sectionInfo, i) =>
                    <SectionDetails key={`accordian-${i}`} sectionInfo={sectionInfo} sectionIndex={i} />
                )}
            </div>
        )
    }
}
