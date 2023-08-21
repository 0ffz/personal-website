---
tags: [wip, selfhost]
title: Setting up a brand new server with Ansible—simpler self-hosting 
layout: layout.webc
date: 2023-08-21
---

Self-hosting services can be a pretty big rabbit hole, or big time-sink for smaller organizations. I hope this series can help build a path for you to get started from scratch, or get ideas about how you could improve your infrastructure to lower maintenance times.

In this part, we'll automate the initial setup of our server using Ansible, which will spin up a simple 'hello world' service using Docker compose. 

## What is Ansible?

Ansible lets us define the state we want our server to be in with YAML files. Ansible will ssh into the server and ensure we reach the defined state.
We can think of it as a more organized set of scripts, except most of the scripts are written for us and we simply need to pass in some arguments for each one.

We can also use Ansible for future maintenance, because each script will make sure nothing changes if it's re-run (nothing will break and no time will be wasted on subsequent runs).

[Jeff Geerling](https://ansible.jeffgeerling.com/) has some great books if you wish to learn more about Ansible after this guide, as well as a [YouTube series covering the book](https://www.youtube.com/watch?v=goclfp6a2IQ&list=PL2_OBreMn7FqZkvMYt6ATmgC0KAGGJNAN). I'll aim to get the basics down so Google can get you the rest of the way there.

## Getting started

Follow the [official installation guide](https://docs.ansible.com/ansible/latest/installation_guide/index.html) to install Ansible on your local system (that's right, since it will SSH into the server, you install it on your own machine). If you're on Windows, using WSL is easiest. Be sure to install via pip and not a package manager since you might get a pretty outdated version with the latter.

### Project structure

There's a lot of ways to use Ansible, so treat this as an opinionated way to get started. [This repository](https://github.com/MineInAbyss/ansible-in-abyss) should reflect how we're currently doing things at Mine in Abyss if you want to have a look.

Thanks to [notthebee/infra](https://github.com/notthebee/infra) for inspiring this simple but effective setup!

Below is what our project directory will look like in the end. We'll cover it bit by bit. 

```text
project/
├── group_vars/
│   └── all/
│       └── vars.yml
├── roles/
│   ├── containers/
│   │   ├── tasks/
│   │   │   └── main.yml
│   │   └── templates/
│   │       └── docker-compose.yml
│   └── system/
│       └── tasks/
│           └── main.yml
├── requirements.yml
└── run.yml
```

### `run.yml`

This is the entrypoint of our playbook, at the end we'll be able to run it by calling `ansible-playbook run.yml`. Here are the contents:

{% raw %}
```yaml
- hosts: rootserver
  vars_files:
    - "{{ lookup('env', 'ANSIBLE_PRIVATE') }}/vault.yml"
  become: yes

  roles:
      - role: system
      - role: geerlingguy.security
      - role: geerlingguy.docker
      - name: containers
```
{% endraw %}

- We define the servers this playbook will run on in `hosts` (we'll later define IPs and ssh keys in an inventory file)
- `vars_files` will load additional variables, in this case secrets on your system at `$ANSIBLE_PRIVATE/vault.yml` that we don't want to track in git.
  - `group_vars/all/vars.yml` will automatically be loaded and used for non-secret variables
- `become: yes` indicates Ansible should escalate to root access once on the server (needed for some roles)
- `roles` defines a list of roles to include

Notice `system` and `containers` are two local roles we defined inside the `roles/` folder.
The other two are roles published to Ansible galaxy, which we include in our requirements file.

### `requirements.yml`

```yaml
roles:
  - name: geerlingguy.security
  - name: geerlingguy.docker
```
We define the roles to import as shown above and can install them using `ansible-galaxy install`, feel free to run this now. 
