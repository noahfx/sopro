#-------------------------------------------------
#
# XMPP Client library based on Gloox
# by Central Services.
#
# Notice that you may have some compilator warnings
# related with a objective code without symbols.
# This warnings must vary depending the target OS
#-------------------------------------------------

QT       -= gui

TARGET = gloox
QT       += core gui multimedia quick sql # network

greaterThan(QT_MAJOR_VERSION, 4): QT += widgets webkitwidgets

LIBS += -lgloox -lresolv -lresolv   -lidn

TEMPLATE = app

