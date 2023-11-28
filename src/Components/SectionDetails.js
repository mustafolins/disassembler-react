import React, { Component } from 'react'
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default class SectionDetails extends Component {

    render() {
        return (

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                    <Typography sx={{ width: '33%', flexShrink: 0 }}>{this.props.sectionInfo.name}</Typography>
                    <Typography sx={{ width: '33%', flexShrink: 0, color: 'text.secondary' }}>Flags: {this.props.sectionCharacteristics}</Typography>
                    <Typography sx={{ width: '33%', flexShrink: 0, color: 'text.third' }}>Length: {this.props.sectionInfo.length}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {this.props.sectionInfo.instructions.map((opCode, j) =>
                        <Typography key={`acc-typ-${this.props.sectionIndex}-${j}`}>
                            {`${j} : ${opCode}`}
                        </Typography>
                    )}
                </AccordionDetails>
            </Accordion>
        )
    }
}
