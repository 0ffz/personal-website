---
tags: [wip, selfhost]
title: OS choice and zfs—simpler selfhost 
layout: layout.webc
date: 2023-08-21
---

This is a companion to the [simpler selfhost](/blog/2023/simpler-selfhost) series with some resources for people that really care about data integrity. I'll be skipping over machine specs, since what you need will vary a lot depending on what you want to run, and almost anything is good enough to fiddle with in a homelab setting.

## OS choice

The nice thing about building out our infrastructure with Docker is that your OS generally doesn't matter. However, since we'll be using Ansible to automate server setup, in my experience Debian based linux distributions have better community support (you'll have to do less work yourself). So we'll stick to Debian!

## Storage and zfs

If you're planning on storing data and want redundancy, zfs has become a popular choice for a filesystem. The issue is it's quite hard to automate its setup and more importantly the maintenance work that follows.

[TrueNAS](https://www.truenas.com/) can simplify this management for you, but it won't give you as much freedom as a bare linux system.
A way to bypass this restriction is to set up a virtual machine running Docker, and mount your data as network attached storage. This approach gives you the best of both worlds, but is more involved since TrueNAS doesn't make it easy for the host machine and VM to talk to each other.

[This guide from Level1Techs](https://www.youtube.com/watch?v=R7BXEuKjJ0k) can help you get started if you really need data integrity, but offsite backups and a simple RAID solution are enough for almost any other service.
