import * as React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { 
    FileDescripiton, 
    FileDescriptions,
    FileTypes,  } from '../../shared/file-types';
import { 
    ReportTitle,
    ReportTitleFile } from '../../shared/report-types';
import { FileContextConsumer } from '../home-cointainers/home';
import './file-inputs.css'



interface FileInputsProps {
    report: ReportTitle 
    fileRefs: {[type: string]: HTMLInputElement | null} 
    selectedValues: {[fileType: string]: string}
    selectedQuarter: string
    handleChange: (ev: React.ChangeEvent<HTMLSelectElement>, f: string) => void
    handleQuarterChange: (ev: React.ChangeEvent<HTMLSelectElement>) => void
}

export const FileInputs: React.FunctionComponent<FileInputsProps> = (props) => {

    const hideUpload = (f : string): 'hidden' | 'visible' => {
        if(props.selectedValues[f] === 'Upload New File'){
            return 'visible'
        }else{
            //resets the upload value on hide
            const uploadElement = document.getElementById(`${props.report.title+f}-file-input`) as HTMLInputElement;
            if (uploadElement !== null){
                uploadElement.value = ""}
            return 'hidden';
        }
    }

    const listToInput = (files: ReportTitleFile[]) =>{
        return (
            <FileContextConsumer>
                {({fileList, addFile}) => {
                    return (
                        <React.Fragment>
                            {files.map( (f, i) => {
                                return (
                                    <React.Fragment key={i}>
                                        <Row>
                                            <Col>
                                                <Form.Label>{f.fileDesc}</Form.Label>
                                                <Form.Text>{FileDescriptions[f.fileType].description}</Form.Text>
                                                <div className='file-upload-options'>
                                                    <LinkButton 
                                                        fDesc={FileDescriptions[f.fileType]}
                                                        fLink={f.altLink}
                                                        />
                                                    {f.fileType === FileTypes.ASSIGNMENTS_SLOW_LOAD ?  <Form.Control 
                                                        as='select'
                                                        value={props.selectedQuarter.length === 1 ? 'Quarter ' + props.selectedQuarter : props.selectedQuarter}
                                                        onChange = {(e) => props.handleQuarterChange(e as React.ChangeEvent<HTMLSelectElement>)}>
                                                        <option>Quarter 1</option>
                                                        <option>Quarter 2</option>
                                                        <option>Quarter 3</option>
                                                        <option>Quarter 4</option>
                                                        <option>Semester 1</option>
                                                        <option>Semester 2</option>
                                                    </Form.Control> : <></>}
                                                </div>
                                            </Col>
                                            <Col>
                                                <Form.Control as='select' onChange={(e)=>props.handleChange(e as React.ChangeEvent<HTMLSelectElement>, f.fileDesc)}
                                                value={props.selectedValues[f.fileDesc]}
                                                id={`${f}-file-select`}>
                                                    {fileList[f.fileType].map( (file, i) => {
                                                        return (
                                                            <option key={file.fileName}>{file.fileName}</option>
                                                        )
                                                    })}
                                                    <option>Upload New File</option>
                                                </Form.Control>
                                                <Form.Control id={`${props.report.title + f.fileDesc}-file-input`}
                                                ref={(ref => props.fileRefs[f.fileDesc] = ref) as any } type='file'
                                                style={{visibility: `${hideUpload(f.fileDesc)}`} as any}/>
                                            </Col>
                                        </Row>
                                        <Row className='justify-content-md-center'>
                                            {i < files.length -1 ? <hr style={{width: '60%'}}/> : null}
                                        </Row>
                                    </React.Fragment>
                                )
                            })}
                        </React.Fragment>
                        )
                    }}
            </FileContextConsumer>
        )
    } 

    return (
        <React.Fragment>
            {listToInput(props.report.files)}
            {props.report.optionalFiles? 
                <React.Fragment>
                    <hr/>
                    <h5 style={{padding: '5px'}}>Optional Files</h5>
                    <hr/>
                    {listToInput(props.report.optionalFiles)} 
                </React.Fragment>
                : null}
        </React.Fragment>
    )
}

const LinkButton: React.SFC<{fDesc: FileDescripiton, fLink: string | undefined}> = (props) => {
    const link = props.fLink ? props.fLink : props.fDesc.link ? props.fDesc.link : null;
    return (
        <>
        {link ? <Button variant='secondary' size='sm' onClick={() => window.open(link, '_blank')}>Instructions</Button> : null}
        </>
    )
}