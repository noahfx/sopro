#-------------------------------------------------
#
# Project created by QtCreator 2015-01-19T12:27:56
#
#-------------------------------------------------

QT       -= gui

TARGET = sql-lite
TEMPLATE = lib
CONFIG += staticlib

SOURCES += ../src/sqlite3.c

HEADERS += ../include/sqlite3.h \
           ../include/sqlite3ext.h
unix {
    target.path = /usr/lib
    INSTALLS += target
}
