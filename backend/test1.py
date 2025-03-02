def postProcess_CBSE_SSC(data,path):
    # Start by copying the main info fields
    result = {
        'Board': data['Board'],
        'Candidate Name': data['Candidate Name'],
        'Father Name': data['Father Name'],
        'Mother Name': data['Mother Name'],
        'Roll Number': int(data['Roll Number']),
        'Date of Birth': data['Date of Birth'],
        'School Name': data['School Name'],
        'Result': data['Result'],
        'Date of Issue': data['Date of Issue']
    }
    
    # Add the subjects into the result with formatted keys
    for i, subject in enumerate(data['Subjects'], start=1):
        result[f'subject {i} code'] = subject['Subject Code']
        result[f'subject {i} Name'] = subject['Subject Name']
        result[f'subject {i} grade'] = subject['Grade']
    Additional_subject=data['Additional Subject']
    result["Additional Subject"]=Additional_subject['Subject Name']
    result["Additional Subject Code"]=Additional_subject['Subject Code']
    result["Additional Subject grade"]=Additional_subject['Grade']
    result["address"]=path.resolve()
    result["File path"]=result["Candidate Name"]
    return result


def postProcess_State_SSC(data,path):
    # Start by copying the main info fields
    result = {
        'Board': data['Board'],
        'Candidate Name': data['Candidate Name'],
        'Father Name': data['Father Name'],
        'Mother Name': data['Mother Name'],
        'Roll Number': int(data['Roll Number']),
        'Date of Birth': data['Date of Birth'],
        'School Name': data['School Name'],
        'CGPA': data['CGPA'],
        'Date of Issue': data['Date of Issue']
    }
    
    # Add the subjects into the result with formatted keys
    for i, subject in enumerate(data['Subjects'], start=1):
        result[f'subject {i} Name'] = subject['Subject Name']
        result[f'subject {i} grade'] = subject['Grade']

    result["address"]=path.resolve()
    result["File path"]=result["Candidate Name"]
    
    return result


def postProcess_State_Inter(data,path):
    # Start by copying the main info fields
    result = {
        'Board': data['Board'],
        'Candidate Name': data['Candidate Name'],
        'Father Name': data['Father Name'],
        'Mother Name': data['Mother Name'],
        'Roll Number': int(data['Roll Number']),
        'Total Marks': data['Total Marks'],
        'Date of Issue': data['Date of Issue']
    }
    
    # Add the subjects into the result with formatted keys
    for i, subject in enumerate(data['Subjects'], start=1):
        result[f'subject {i} Name'] = subject['Subject Name']
        result[f'subject {i} 1st Yr Marks'] = subject["1st Yr Marks"]
        result[f'subject {i} 2nd Yr Marks'] = subject["2nd Yr Marks"]


    for j, subjectP in enumerate(data['Practicals'], start=1):
        result[f'Practical {j} Name'] = subjectP['Subject Name']
        result[f'Practical {j} Marks'] = subjectP["Marks"]

    result["address"]=path.resolve()
    result["File path"]=result["Candidate Name"]
    return result

