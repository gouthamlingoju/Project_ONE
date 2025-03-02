import shutil
from typing import Any,Dict
from PIL import Image
from google import genai
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import FileResponse
from starlette.middleware.cors import CORSMiddleware
from pathlib import Path
import os
from dotenv import load_dotenv
from test import append_to_excel, process_certificate
from test1 import postProcess_CBSE_SSC,postProcess_State_Inter,postProcess_State_SSC
from test import Prompt_Inter_CBSE,Prompt_Inter_ICSE,Prompt_SSC_CBSE,Prompt_SSC_ICSE,Prompt_SSC_State,Prompt_Inter_State
import json

file_path_new=''
Standard = ""
Board = ""
Year = ""

app= FastAPI()

load_dotenv()

client=genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get('/')
async def check():
    return {"Message":"Running successfully!!!"}

@app.post("/extract/")
async def upload_files(standard : str = Form(...),
                       board :str = Form(...),
                       year : int = Form(...),
                       file: UploadFile = File(...)):
    global file_path_new,Standard,Board,Year,General_Prompt
    Standard = "SSC" if standard=="10th Grade" else "Inter"
    Board = board
    Year = year
    if standard=="10th Grade":
        if board=="State Board":
            General_Prompt=Prompt_SSC_State
            process_certificate=postProcess_State_SSC
        if board=="CBSE":
            General_Prompt=Prompt_SSC_CBSE
            process_certificate=postProcess_CBSE_SSC
        if board=="ICSE":
            General_Prompt=Prompt_SSC_ICSE
            process_certificate=process_certificate
    if standard=="Intermediate":
        if board=="State Board":
            General_Prompt=Prompt_Inter_State
            process_certificate=postProcess_State_Inter
        if board=="CBSE":
            General_Prompt=Prompt_Inter_CBSE
            process_certificate=process_certificate
        if board=="ICSE":
            General_Prompt=Prompt_Inter_ICSE
            process_certificate=process_certificate


    try:
        # year = int(year)
        main_dir = Path(f"uploads")
        main_dir.mkdir(exist_ok=True)
        subfolder_name = f"{standard}_{board}_{year}"
        subfolder_path = main_dir / subfolder_name
        subfolder_path.mkdir(exist_ok=True)

        file_path = subfolder_path / file.filename
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        image = Image.open(file_path)
        response = client.models.generate_content(
                        model="gemini-2.0-flash",
                        contents=[image,General_Prompt],
                    )
        
        data_dict = json.loads(response.text.split("```")[1][5:])
        
        roll_number = data_dict.get("Roll Number", "unknown")
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{Standard}_{roll_number}{file_extension}"
        file_path_n = subfolder_path / unique_filename
        file_path_new = file_path_n
        if os.path.exists(file_path_n):
            os.remove(file_path_n)

        os.rename(file_path,file_path_n)
        data_dict=process_certificate(data_dict,file_path_new)
        return {"Files":"Success","AI":data_dict,"Response":response.text}
    except Exception as e:
        return {"Error":str(e)}
    

# POST endpoint to receive the data
@app.post("/convert/")
async def receive_data(my_data: Dict):
    global file_path_new
    excel_path = Standard+'_'+Board+'_'+str(Year)+".xlsx"
    append_to_excel(my_data, excel_path, file_path_new, Standard, Board)
    return {"received_data": my_data}

@app.get("/download/")
async def download_excel():
    excel_path = Standard+'_'+Board+'_'+str(Year)+".xlsx"
    if os.path.exists(excel_path):
        return FileResponse(
            excel_path,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            filename="certificates.xlsx"
        )
    return {"error": "Excel file not found"}