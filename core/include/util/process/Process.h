// Methods used to check if a particular process is running




#ifdef Q_OS_WIN  //TODO: Test on windows environment
#include <cstdio>
#include <windows.h>
#include <tlhelp32.h>


bool IsProcessRunning(const wchar_t *processName)
{
    bool exists = false;
    PROCESSENTRY32 entry;
    entry.dwSize = sizeof(PROCESSENTRY32);

    HANDLE snapshot = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, NULL);

    if (Process32First(snapshot, &entry))
        while (Process32Next(snapshot, &entry))
            if (!wcsicmp(entry.szExeFile, processName))
                exists = true;

    CloseHandle(snapshot);
    return exists;
}
#else
#include <sys/types.h>
#include <signal.h>
#include <stdio.h>
#include <string>
#include <vector>
#include <sstream>
#include <iostream>
using namespace std;
// execute a command on a unix based system
std::string exec(char* cmd) {
    FILE* pipe = popen(cmd, "r");
    if (!pipe) return "ERROR";
    char buffer[128];
    std::string result = "";
    while(!feof(pipe)) {
        if(fgets(buffer, 128, pipe) != NULL)
            result += buffer;
    }
    pclose(pipe);
    return result;
}

// given a comamnd output count the lines
int countCommandOutput(std::string commandOutput )

{
     vector<string> strings;
     istringstream stream(commandOutput);
     std::string strline;
     int lines =0;

while (getline(stream, strline, '\n'))
{
    lines++;
    strings.push_back(strline);
}
    //fprintf(stdout, "\n output has %i lines.",lines);
return lines;
}

bool IsProcessRunning(const wchar_t *processName)
{   std::string strProcessName((char*)processName);
    std::string strCommand = "ps -A  |grep "+strProcessName+" | grep -v grep";

    std::string strCommandOutput = exec((char *)strCommand.c_str());
    if (strCommandOutput.length() > 0) {
        if(strCommandOutput.compare("ERROR")== 0)
          {
            // the process is running
            return false;
           }
    fprintf(stdout,"\nProcess output: \n %s\n",strCommandOutput.c_str());
    // Here if we have more than 1 process running (counting the current process)
    // then there is a process running...

    if (countCommandOutput(strCommandOutput) > 1)
    {
        return true;
    }
    // there is only 1 process running (itself) so continue the run
    return false;
    }
    else
    fprintf(stdout,"The process with name %s is not running. \n",strProcessName.c_str());
    return false;
}

#endif
