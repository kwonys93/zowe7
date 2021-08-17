       IDENTIFICATION DIVISION.                                                 
       PROGRAM-ID. FAPCOB05.                                                    
      ******************************************************************        
      *REMARKS.  BATCH COBOL PROGRAM - NO  SUBROUTINES, NO LINK CARDS.          
      *          TO COMPILE USE PROCESSOR COBNBLP (OR COBNBL).                  
      *       HELLO  -change 1                            
      ******************************************************************        
       ENVIRONMENT DIVISION.                                                    
       INPUT-OUTPUT SECTION.                                                    
       FILE-CONTROL.                                                            
       DATA DIVISION.                                                           
      *  VERSION 2 OF FAPCOB 02 ****************************************        
       WORKING-STORAGE SECTION.                                                 
       COPY FAPHDR.                                                             
       01  PROGRAM-WORK-FIELDS.                                                 
           02  INPUT-SWITCH      PIC X(3).                                      
               88  END-OF-FILE   VALUE 'EOF'.                                   
           02  LINES-WRITTEN     PIC 9(3).                                      
               88  NEW-PAGE      VALUE 30.                                      
           02  PAGE-COUNT        PIC 9(3).                                      
       COPY FAPPAGE.                                                            
       01  DATA-LINE.                                                           
           02  FILLER                PIC X(5).                                  
           02  OUTPUT-FIELD1         PIC ZZ,ZZZ,ZZ9.                            
           02  FILLER                PIC X(5).                                  
           02  OUTPUT-FIELD2         PIC X(10).                                 
           02  FILLER                PIC X(5).                                  
           02  OUTPUT-FIELD3         PIC X(20).                                 
           02  FILLER                PIC X(5).                                  
           02  OUTPUT-FIELD4         PIC ZZZ,ZZ9.                               
           02  FILLER                PIC X(5).                                  
           02  OUTPUT-FIELD5         PIC ZZZ,ZZ9.                               
           02  FILLER                PIC X(5).                                  
           02  OUTPUT-TOTAL          PIC ZZZ,ZZZ,ZZZ,ZZZ,ZZ9.                   
           02  FILLER                PIC X(30).                                 
       COPY FARINCL.                                                            
      ******************************************************************        
       PROCEDURE DIVISION.                                                      
      ******************************************************************        
           GOBACK.                                                              
