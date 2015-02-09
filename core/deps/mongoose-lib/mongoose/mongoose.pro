#-------------------------------------------------
#
# MONGOOSE webserver library
# Societas dependency.
# Compile and put the static library on the right
# library path
#-------------------------------------------------

QT       -= gui

TARGET = mongoose
TEMPLATE = lib
CONFIG += staticlib
INCLUDEPATH +=../include
HEADERS += \
    ../include/mongoose.h

SOURCES += \
    ../src/mongoose.c

