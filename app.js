// ================================================================
// Linux Intent → Command Finder
// ================================================================
// EDITING RULE:
// 1. To ADD/EDIT commands, change only the `commands` array below.
// 2. Every command object has the same fields:
//    id, name, category, command, description, keywords, flags,
//    examples, notes, related.
// 3. Keep exactly 10 human-searchable phrases in `keywords` for now.
// 4. Search behavior is below the data and normally does not need edits.
// 5. UI settings live in CONFIG.
//
// This V1 intentionally uses simple keyword scoring.
// No AI, database, backend, login, or external library is required.
// ================================================================

const CONFIG = { minScore: 8, maxResults: 8, showFlags: true, showExamples: true, showCategories: true, showNotes: true };

const commands = [
  { id: "rm", name: "Remove files or folders", category: "Files", command: "rm -r folder-name", description: "Deletes files and directories.", keywords: ["delete a folder", "remove directory", "delete directory", "remove files", "delete files", "erase folder", "delete a file", "remove a folder", "clean up files", "delete recursively"], flags: [["-r", "remove directories and their contents recursively"], ["-f", "do not prompt for confirmation"]], examples: ["rm file.txt", "rm -r old-folder", "rm -rf old-folder"], notes: "Be careful: deleted files usually cannot be recovered.", related: [] },
  { id: "ps", name: "View running processes", category: "Processes", command: "ps aux", description: "Lists currently running processes.", keywords: ["check running processes", "list processes", "see active processes", "what is running", "find process", "running programs", "show processes", "process list", "view processes", "check cpu process"], flags: [["a", "show processes for all users"], ["u", "show user-oriented details"], ["x", "include processes without a terminal"]], examples: ["ps aux", "ps aux | grep nginx"], notes: "Use top or htop for a live process view.", related: [] },
  { id: "find", name: "Find files", category: "Files", command: "find /path -name 'file-name'", description: "Searches for files and directories by name.", keywords: ["find a file", "search file", "locate file", "find filename", "find folder", "search directory", "where is file", "look for file", "find files by name", "locate directory"], flags: [["-name", "match a file name"], ["-type", "limit results to a file type"]], examples: ["find . -name 'report.txt'", "find /var/log -type f -name '*.log'"], notes: "Quote patterns such as *.log so the shell does not expand them first.", related: [] },
  { id: "ss", name: "Show open ports", category: "Networking", command: "ss -tulpn", description: "Shows listening network sockets and their processes.", keywords: ["show open ports", "check open ports", "list listening ports", "network ports", "what ports are open", "see ports", "port usage", "list sockets", "check listening services", "open connections"], flags: [["-t", "show TCP sockets"], ["-u", "show UDP sockets"], ["-l", "show listening sockets"], ["-p", "show process information"], ["-n", "do not resolve names"]], examples: ["ss -tulpn", "ss -ltn"], notes: "Some process details require sudo.", related: [] },
  { id: "chmod", name: "Change permissions", category: "Permissions", command: "chmod 644 file-name", description: "Changes file or directory permissions.", keywords: ["change permissions", "set file permissions", "make executable", "chmod file", "permission denied", "fix permissions", "change mode", "file access", "directory permissions", "make script executable"], flags: [["-R", "apply changes recursively"]], examples: ["chmod 644 report.txt", "chmod +x script.sh", "chmod -R 755 public-html"], notes: "Use the least permissive mode that meets your need.", related: [] },
  { id: "df", name: "Check disk space", category: "System", command: "df -h", description: "Displays used and available space on mounted filesystems.", keywords: ["check disk space", "disk usage", "free storage", "storage full", "available disk", "filesystem space", "how much disk", "check free space", "disk full", "show disk usage"], flags: [["-h", "show sizes in a human-readable format"]], examples: ["df -h", "df -h /home"], notes: "Use du -sh directory-name to measure one directory.", related: [] },
  { id: "cp", name: "Copy files", category: "Files", command: "cp source destination", description: "Copies files or directories to another location.", keywords: ["copy file", "copy folder", "duplicate file", "duplicate directory", "backup file", "copy directory", "copy files", "move a copy", "clone folder", "save copy"], flags: [["-r", "copy directories recursively"]], examples: ["cp report.txt backup/", "cp -r project project-backup"], notes: "Use -i if you want a prompt before overwriting files.", related: [] },
  { id: "mv", name: "Move or rename files", category: "Files", command: "mv old-name new-name", description: "Moves a file or directory, or renames it.", keywords: ["rename file", "move file", "rename folder", "move directory", "change filename", "relocate file", "move files", "rename directory", "change folder name", "move a folder"], flags: [["-i", "prompt before overwriting"]], examples: ["mv draft.txt final.txt", "mv report.txt documents/"], notes: "Moving across filesystems may copy then delete the original.", related: [] },
  { id: "grep", name: "Search text in files", category: "Text", command: "grep -R 'text' path", description: "Finds lines that match text or a pattern.", keywords: ["search text", "find text in file", "grep text", "search file contents", "look for word", "find string", "search logs", "text pattern", "find line", "search recursively"], flags: [["-R", "search directories recursively"], ["-n", "show line numbers"], ["-i", "ignore letter case"]], examples: ["grep 'error' app.log", "grep -Rni 'TODO' src/"], notes: "Use quotes around search text that includes spaces or special characters.", related: [] },
  { id: "kill", name: "Stop a process", category: "Processes", command: "kill process-id", description: "Sends a signal to a running process.", keywords: ["stop process", "kill process", "end program", "terminate process", "close running program", "force stop", "stop service process", "kill pid", "end task", "terminate program"], flags: [["-9", "force termination when normal termination fails"]], examples: ["kill 1234", "kill -9 1234"], notes: "Try a normal kill first; -9 prevents the process from cleaning up.", related: [] },
  { id: "passwd", name: "passwd", category: "User Management", command: "passwd", description: "Changes the password of a user account.", keywords: ["set password", "change password", "change my password", "change user password", "reset password", "update password", "set user password", "modify password", "change account password", "password command"], flags: [["-d", "Delete the user's password"], ["-l", "Lock the user's password"], ["-u", "Unlock the user's password"], ["-S", "Display password status"]], examples: ["passwd", "sudo passwd username"], notes: "Running passwd without a username changes the current user's password. Administrative privileges are normally required to change another user's password.", related: ["useradd", "usermod", "chage"] },
  { id: "useradd", name: "useradd", category: "User Management", command: "sudo useradd -m username", description: "Creates a new user account.", keywords: ["add user", "create user", "new user", "create account", "add linux user", "user account", "make user", "register user", "add account", "useradd command"], flags: [["-m", "Create the user's home directory"], ["-s", "Set the login shell"]], examples: ["sudo useradd -m alice", "sudo useradd -m -s /bin/bash alice"], notes: "Set a password with passwd after creating the account.", related: ["passwd", "usermod", "userdel"] },
  { id: "usermod", name: "usermod", category: "User Management", command: "sudo usermod options username", description: "Modifies an existing user account.", keywords: ["modify user", "change user", "edit user", "add user group", "change username", "change user shell", "update account", "usermod command", "user settings", "manage user"], flags: [["-aG", "Append the user to supplementary groups"], ["-s", "Set the login shell"]], examples: ["sudo usermod -aG wheel alice", "sudo usermod -s /bin/bash alice"], notes: "Use -a with -G so existing supplementary group memberships are kept.", related: ["useradd", "passwd", "chage"] },
  { id: "userdel", name: "userdel", category: "User Management", command: "sudo userdel -r username", description: "Removes a user account.", keywords: ["delete user", "remove user", "delete account", "remove account", "userdel command", "remove linux user", "disable user", "erase user", "delete user home", "remove user account"], flags: [["-r", "Remove the user's home directory and mail spool"]], examples: ["sudo userdel alice", "sudo userdel -r alice"], notes: "Review the account and its files before removing it.", related: ["useradd", "usermod", "passwd"] },
  { id: "chage", name: "chage", category: "User Management", command: "sudo chage -l username", description: "Views or changes password aging information.", keywords: ["password expiry", "password expiration", "password aging", "password policy", "change password expiry", "password expire date", "chage command", "account expiry", "force password change", "view password status"], flags: [["-l", "List password aging information"], ["-M", "Set maximum password age"]], examples: ["sudo chage -l alice", "sudo chage -M 90 alice"], notes: "Password aging settings usually require administrative privileges.", related: ["passwd", "usermod", "useradd"] }
];

// Additional command entries from the complete V1 catalogue.  `entry` keeps
// the data concise while still using the same shape as the richer cards above.
function entry(name, command, description, keywords, example = command) {
  return { id: name.replace(/[^a-z0-9]+/gi, "-"), name, category: "Linux", command, description, keywords, flags: [], examples: [example], notes: "", related: [] };
}

commands.push(
  entry("Print current directory", "pwd", "Prints the current working directory.", ["where am i", "current directory", "current folder", "working directory", "path", "location"]),
  entry("Change directory", "cd /path/to/directory", "Changes the current working directory.", ["change directory", "change folder", "go to folder", "enter folder", "navigate", "directory"], "cd /var/log"),
  entry("List files", "ls -la", "Lists files and directories, including hidden files.", ["list files", "show files", "list directory", "show directory", "hidden files", "file listing"], "ls -la /home"),
  entry("Create directory", "mkdir -p /path/to/directory", "Creates a directory and any missing parent directories.", ["create folder", "create directory", "make folder", "make directory", "new folder"], "mkdir -p project/src"),
  entry("Remove empty directory", "rmdir directory", "Removes an empty directory.", ["remove empty folder", "delete empty folder", "remove directory", "delete directory"], "rmdir olddir"),
  entry("Create empty file", "touch file.txt", "Creates an empty file or updates its timestamps.", ["create file", "new file", "empty file", "make file"], "touch notes.txt"),
  entry("Display file contents", "cat file.txt", "Displays the contents of a file.", ["read file", "show file", "display file", "file contents", "view file"], "cat /etc/passwd"),
  entry("Show first lines", "head -n 10 file.txt", "Displays the first lines of a file.", ["first lines", "top of file", "beginning of file", "show first lines"], "head -n 5 log.txt"),
  entry("Show last lines", "tail -n 10 file.txt", "Displays the last lines of a file.", ["last lines", "bottom of file", "end of file", "show last lines"], "tail -n 20 log.txt"),
  entry("Follow a log", "tail -f logfile", "Continuously displays new content written to a file.", ["watch log", "follow log", "live log", "real time log", "monitor log", "watch file"], "tail -f /var/log/messages"),
  entry("Search text recursively", "grep -r 'pattern' directory", "Searches recursively through files under a directory.", ["search recursively", "recursive search", "search directory", "find text in folder"], "grep -r 'root' /etc"),
  entry("View large file", "less file.txt", "Views a text file page by page.", ["view large file", "read large file", "pager", "scroll file", "inspect log"], "less /var/log/messages"),
  entry("Count lines", "wc -l file.txt", "Counts lines in a file.", ["count lines", "count words", "count characters", "count file"], "wc -l /etc/passwd"),
  entry("Find command path", "which command", "Shows the full path of a command.", ["where command", "command path", "find executable", "path of command"], "which ssh"),
  entry("Directory disk usage", "du -sh directory", "Shows disk space used by a file or directory.", ["folder size", "directory size", "space used by folder", "disk usage folder", "file size usage"], "du -sh /var/log"),
  entry("Memory usage", "free -h", "Displays RAM and swap memory usage.", ["memory usage", "ram usage", "check ram", "swap memory", "memory"]),
  entry("System information", "uname -a", "Displays Linux kernel and system information.", ["system information", "kernel information", "linux version", "system details"]),
  entry("Show hostname", "hostname", "Displays the system hostname.", ["hostname", "computer name", "machine name", "system name"]),
  entry("Command history", "history", "Shows commands previously run in the shell.", ["command history", "previous commands", "old commands", "commands used"]),
  entry("Test network reachability", "ping -c 4 192.168.1.1", "Tests network reachability using ICMP echo requests.", ["check network", "test connectivity", "test connection", "network reachable", "reach host", "ping"], "ping -c 4 8.8.8.8"),
  entry("Show IP addresses", "ip addr show", "Displays IP addresses and network interface configuration.", ["show ip", "check ip address", "network interface", "ip address", "network configuration"]),
  entry("DNS lookup", "dig example.com", "Queries DNS information for a domain.", ["dns lookup", "check dns", "domain ip", "dns record", "resolve domain"]),
  entry("Download with wget", "wget URL", "Downloads a file from a URL.", ["download file", "download url", "get file", "download from web"], "wget https://example.com/file.zip"),
  entry("HTTP request with curl", "curl URL", "Transfers data to or from a URL.", ["request url", "http request", "fetch url", "web request", "download with curl"], "curl https://example.com"),
  entry("Live process monitor", "top", "Monitors running processes and system activity in real time.", ["monitor processes", "live processes", "process monitor", "cpu usage", "process activity"]),
  entry("List shell jobs", "jobs", "Lists active jobs from the current shell.", ["shell jobs", "background jobs", "active jobs", "job list"]),
  entry("Foreground a job", "fg %1", "Brings a shell job to the foreground.", ["foreground job", "bring job foreground", "foreground process"]),
  entry("Background a job", "bg %1", "Resumes a suspended job in the background.", ["background job", "resume background", "run job background"]),
  entry("Kill by process name", "pkill process_name", "Terminates processes by name.", ["kill process", "stop process", "terminate process", "kill by name"], "pkill firefox"),
  entry("Start with priority", "nice -n 10 command", "Starts a process with a scheduling niceness value.", ["process priority", "start with priority", "nice process", "cpu priority"], "nice -n 10 myscript.sh"),
  entry("Change process priority", "renice -n 10 -p 1234", "Changes the niceness of a running process.", ["change process priority", "renice process", "running process priority"]),
  entry("Change owner", "chown user:group file", "Changes file or directory ownership.", ["change owner", "file owner", "change ownership", "owner group"], "chown user:developers project/"),
  entry("Change group", "chgrp group file", "Changes group ownership.", ["change group", "group owner", "file group", "directory group"], "chgrp developers project/"),
  entry("View ACL", "getfacl file", "Displays Access Control List permissions.", ["view acl", "show acl", "access control list", "acl permissions"]),
  entry("Set ACL", "setfacl -m u:user:rwx file", "Adds or modifies an ACL entry.", ["set acl", "add acl", "give user permission", "specific user permission", "acl"], "setfacl -m u:alice:rwx project/"),
  entry("Create tar archive", "tar -cvf archive.tar directory", "Creates an archive containing files or directories.", ["archive files", "create tar", "tar archive", "backup files", "package files"], "tar -cvf backup.tar project/"),
  entry("Extract tar archive", "tar -xvf archive.tar", "Extracts files from a tar archive.", ["extract tar", "unpack archive", "untar", "extract archive"], "tar -xvf backup.tar"),
  entry("Check service status", "systemctl status service", "Checks the status of a systemd service.", ["service status", "check service", "systemd service", "service running"], "systemctl status sshd"),
  entry("Start service", "systemctl start service", "Starts a systemd service.", ["start service", "run service", "start daemon"], "systemctl start httpd"),
  entry("Enable service at boot", "systemctl enable service", "Configures a service to start at boot.", ["enable service", "start at boot", "boot service", "automatic service"], "systemctl enable httpd"),
  entry("Show firewall rules", "firewall-cmd --list-all", "Displays the current firewalld configuration.", ["firewall rules", "check firewall", "firewalld", "allowed ports", "firewall"]),
  entry("Allow firewall service", "firewall-cmd --add-service=http --permanent", "Permanently allows a firewalld service.", ["allow http", "open firewall service", "allow service", "firewall port", "open web port"]),
  entry("Schedule cron job", "crontab -e", "Opens the current user's cron table for editing.", ["schedule command", "scheduled task", "cron job", "schedule task", "automatic task"]),
  entry("Connect with SSH", "ssh user@remote_host", "Connects to a remote Linux system using SSH.", ["remote login", "remote server", "connect ssh", "login remote", "ssh"], "ssh user@192.168.1.20"),
  entry("Generate SSH key", "ssh-keygen -t rsa -b 4096", "Generates an SSH public/private key pair.", ["ssh key", "generate ssh key", "key pair", "passwordless ssh", "public key"]),
  entry("List network connections", "nmcli connection show", "Lists NetworkManager connection profiles.", ["network connections", "networkmanager", "nmcli", "show network profiles"]),
  entry("Mount filesystem", "mount /dev/sdb1 /mnt/data", "Attaches a filesystem to a directory.", ["mount disk", "mount filesystem", "attach disk", "mount partition"]),
  entry("Unmount filesystem", "umount /mnt/data", "Detaches a mounted filesystem.", ["unmount disk", "unmount filesystem", "detach disk", "remove mount"]),
  entry("List disks", "lsblk", "Lists block devices and their partitions.", ["list disks", "show disks", "show partitions", "block devices", "storage devices"]),
  entry("Format ext4 partition", "mkfs.ext4 /dev/sdb1", "Creates an ext4 filesystem on a partition.", ["format disk", "format partition", "create filesystem", "filesystem", "mkfs"])
);

// Extended V1 catalogue. Each row is: name, command, description, keywords,
// example. Entries whose command is already above are intentionally omitted.
const extendedCommands = [
  ["Create symbolic link", "ln -s target link-name", "Creates a symbolic link to a file or directory.", ["create symlink", "symbolic link", "link file", "shortcut file"], "ln -s /path/to/file shortcut"],
  ["Show file details", "stat file", "Displays detailed metadata for a file.", ["file details", "file metadata", "file timestamps", "stat file"]],
  ["Identify file type", "file file-name", "Identifies a file's type.", ["file type", "identify file", "what type of file", "inspect file"]],
  ["Get base filename", "basename /path/to/file", "Prints the final filename portion of a path.", ["filename from path", "base filename", "remove directory path"]],
  ["Get directory path", "dirname /path/to/file", "Prints the directory portion of a path.", ["directory from path", "parent directory", "dirname"]],
  ["Sort text", "sort file.txt", "Sorts lines of text.", ["sort file", "sort lines", "alphabetical sort", "sort text"]],
  ["Remove duplicate lines", "uniq file.txt", "Filters adjacent duplicate lines.", ["remove duplicates", "unique lines", "deduplicate text", "uniq"]],
  ["Extract text columns", "cut -d ':' -f 1 file.txt", "Extracts selected columns from text.", ["extract column", "split text", "cut field", "text columns"]],
  ["Translate characters", "tr 'a-z' 'A-Z'", "Replaces or deletes characters from input.", ["convert lowercase", "translate text", "replace characters", "uppercase text"]],
  ["Write output to file", "command | tee file.txt", "Writes command output to both the terminal and a file.", ["save command output", "write output file", "tee command", "copy terminal output"]],
  ["Compare files", "diff file1 file2", "Shows differences between two files.", ["compare files", "file differences", "diff files", "compare text"]],
  ["Compare files byte by byte", "cmp file1 file2", "Compares two files byte by byte.", ["compare binary files", "cmp files", "same file", "file comparison"]],
  ["Apply patch", "patch < changes.patch", "Applies changes from a patch file.", ["apply patch", "patch file", "apply diff", "update source patch"]],
  ["Stream editor", "sed 's/old/new/g' file.txt", "Searches and transforms text streams.", ["replace text", "edit text command", "sed replace", "substitute text"]],
  ["Process text fields", "awk '{print $1}' file.txt", "Processes structured text using patterns and fields.", ["awk command", "extract text field", "process columns", "filter text"]],
  ["View system logs", "journalctl", "Displays logs collected by systemd.", ["view logs", "system logs", "journal logs", "service logs"]],
  ["Write system log message", "logger 'message'", "Writes a message to the system log.", ["write log", "system log message", "logger command", "log message"]],
  ["Compress with gzip", "gzip file.txt", "Compresses a file with gzip.", ["gzip file", "compress file", "zip gzip", "reduce file size"]],
  ["Decompress gzip file", "gunzip file.txt.gz", "Decompresses a gzip-compressed file.", ["unzip gzip", "decompress file", "extract gz", "gunzip"]],
  ["Create zip archive", "zip -r archive.zip directory", "Creates a ZIP archive.", ["create zip", "zip folder", "compress zip", "zip archive"]],
  ["Extract zip archive", "unzip archive.zip", "Extracts files from a ZIP archive.", ["extract zip", "unzip file", "open zip", "decompress zip"]],
  ["Compress with xz", "xz file.txt", "Compresses a file with xz.", ["xz compress", "compress xz", "xz file"]],
  ["Compress with bzip2", "bzip2 file.txt", "Compresses a file with bzip2.", ["bzip2 compress", "compress bz2", "bzip file"]],
  ["Current user", "whoami", "Prints the current effective username.", ["current user", "who am i", "logged in user", "my username"]],
  ["Show user identity", "id", "Displays user and group IDs.", ["user id", "my groups", "user groups", "identity"]],
  ["Show user groups", "groups username", "Displays group memberships for a user.", ["show groups", "user groups", "group membership", "which groups"]],
  ["Show logged-in users", "who", "Lists users currently logged in.", ["logged in users", "who is logged in", "active users", "show users"]],
  ["Show user activity", "w", "Shows logged-in users and their activity.", ["user activity", "who is active", "logged in activity", "w command"]],
  ["Create group", "sudo groupadd group-name", "Creates a new user group.", ["add group", "create group", "new group", "groupadd"]],
  ["Modify group", "sudo groupmod options group-name", "Modifies an existing user group.", ["modify group", "rename group", "change group", "groupmod"]],
  ["Delete group", "sudo groupdel group-name", "Deletes a user group.", ["delete group", "remove group", "groupdel", "remove user group"]],
  ["Manage group password", "sudo gpasswd group-name", "Administers a group's password and membership.", ["group password", "manage group members", "gpasswd", "group admin"]],
  ["Switch user", "su - username", "Switches to another user account.", ["switch user", "become user", "login as user", "su command"]],
  ["Run as administrator", "sudo command", "Runs a command with administrative privileges.", ["administrator command", "run as root", "sudo command", "elevated command"]],
  ["Find process by name", "pgrep process-name", "Finds process IDs by process name.", ["find pid", "process id", "find process name", "pgrep"]],
  ["Stop processes by name", "killall process-name", "Terminates all processes with a given name.", ["kill all process", "stop by name", "terminate by name", "killall"]],
  ["Interactive process monitor", "htop", "Provides an interactive process and system monitor.", ["interactive process monitor", "htop", "monitor cpu memory", "process viewer"]],
  ["Show system uptime", "uptime", "Shows how long the system has been running and its load.", ["system uptime", "system load", "how long running", "uptime"]],
  ["List open files", "lsof", "Lists open files and the processes using them.", ["open files", "process using file", "find open port process", "lsof"]],
  ["Keep process running", "nohup command &", "Runs a command that continues after logout.", ["run after logout", "background persistent", "keep process running", "nohup"]],
  ["Show routes", "ip route show", "Displays the IP routing table.", ["routing table", "network route", "default gateway", "show routes"]],
  ["Trace network route", "traceroute host", "Shows the network path to a host.", ["trace route", "network path", "traceroute", "hops to host"]],
  ["DNS lookup with nslookup", "nslookup domain", "Queries DNS records for a domain.", ["nslookup", "dns lookup", "domain lookup", "resolve domain"]],
  ["DNS lookup with host", "host domain", "Looks up DNS information for a hostname.", ["host lookup", "dns host", "resolve hostname", "domain ip"]],
  ["Show network connections", "netstat -tulpn", "Displays network connections and listening ports.", ["netstat", "network connections", "listening ports", "open sockets"]],
  ["Copy files over SSH", "scp file user@host:/path", "Securely copies files between systems over SSH.", ["copy remote file", "scp file", "transfer ssh", "upload ssh"]],
  ["Synchronize files", "rsync -av source destination", "Efficiently synchronizes files and directories.", ["sync files", "backup files", "rsync", "copy changes only"]],
  ["Transfer files with SFTP", "sftp user@host", "Starts an interactive secure file-transfer session.", ["sftp", "secure file transfer", "transfer remote files", "remote file upload"]],
  ["Install packages with apt", "sudo apt install package", "Installs a package on Debian or Ubuntu systems.", ["install package ubuntu", "apt install", "debian package", "install software"]],
  ["Install packages with apt-get", "sudo apt-get install package", "Installs a package using apt-get.", ["apt get install", "install package debian", "apt-get", "install software"]],
  ["Install packages with dnf", "sudo dnf install package", "Installs a package on Fedora, RHEL, or similar systems.", ["dnf install", "fedora package", "rhel package", "install software"]],
  ["Install packages with yum", "sudo yum install package", "Installs a package using yum.", ["yum install", "centos package", "rhel package manager", "install software"]],
  ["Install RPM package", "sudo rpm -ivh package.rpm", "Installs an RPM package file.", ["install rpm", "rpm package", "rpm install", "local rpm"]],
  ["Install DEB package", "sudo dpkg -i package.deb", "Installs a Debian package file.", ["install deb", "dpkg install", "debian package file", "local deb"]],
  ["Install snap package", "sudo snap install package", "Installs a Snap package.", ["snap install", "install snap", "snap package", "install software"]],
  ["Stop service", "sudo systemctl stop service", "Stops a systemd service.", ["stop service", "stop daemon", "disable running service", "systemctl stop"]],
  ["Restart service", "sudo systemctl restart service", "Restarts a systemd service.", ["restart service", "restart daemon", "reload service process", "systemctl restart"]],
  ["Disable service at boot", "sudo systemctl disable service", "Prevents a systemd service from starting at boot.", ["disable service", "stop at boot", "turn off service boot", "systemctl disable"]],
  ["Reload service", "sudo systemctl reload service", "Reloads a service configuration without a full restart.", ["reload service", "reload daemon config", "apply service config", "systemctl reload"]],
  ["Show service logs", "journalctl -u service", "Shows logs for a specific systemd service.", ["service logs", "journalctl service", "view daemon logs", "systemd logs"]],
  ["Show block device IDs", "blkid", "Displays block-device UUIDs and filesystem types.", ["disk uuid", "filesystem uuid", "block device id", "blkid"]],
  ["Partition disk with fdisk", "sudo fdisk /dev/sdb", "Creates or edits disk partitions interactively.", ["partition disk", "fdisk", "create partition", "disk partition"]],
  ["Partition disk with parted", "sudo parted /dev/sdb", "Creates or edits disk partitions with parted.", ["parted", "partition drive", "disk partition tool", "edit partitions"]],
  ["Check filesystem", "sudo fsck /dev/sdb1", "Checks and repairs a filesystem.", ["check filesystem", "repair filesystem", "fsck", "fix disk errors"]],
  ["Enable swap", "sudo swapon /swapfile", "Enables a swap device or file.", ["enable swap", "turn on swap", "activate swap", "swapon"]],
  ["Disable swap", "sudo swapoff /swapfile", "Disables a swap device or file.", ["disable swap", "turn off swap", "deactivate swap", "swapoff"]],
  ["Set default permissions", "umask 022", "Sets default permissions for newly created files.", ["default permissions", "new file permissions", "umask", "permission mask"]],
  ["Edit sudo rules safely", "sudo visudo", "Safely edits the sudoers configuration.", ["edit sudoers", "sudo permissions", "visudo", "grant sudo access"]],
  ["Copy SSH public key", "ssh-copy-id user@host", "Installs an SSH public key on a remote account.", ["copy ssh key", "passwordless ssh", "install public key", "ssh copy id"]],
  ["Show date and time", "date", "Displays or formats the system date and time.", ["current date", "current time", "show date", "system time"]],
  ["Show calendar", "cal", "Displays a calendar.", ["calendar", "show month", "show calendar", "cal command"]],
  ["Configure time", "timedatectl status", "Shows or configures system time settings.", ["timezone", "time settings", "system clock", "timedatectl"]],
  ["Show environment", "env", "Displays environment variables.", ["environment variables", "show environment", "env command", "shell environment"]],
  ["Print environment variable", "printenv VARIABLE", "Prints environment variables.", ["print environment", "show variable", "environment variable value", "printenv"]],
  ["Set environment variable", "export NAME=value", "Sets an environment variable for the current shell.", ["set environment variable", "export variable", "shell variable", "set env"]],
  ["Create shell alias", "alias name='command'", "Creates a command alias for the current shell.", ["create alias", "shortcut command", "shell alias", "alias command"]],
  ["Terminal multiplexer", "screen", "Starts a detachable terminal session.", ["detached terminal", "screen session", "keep terminal session", "terminal multiplexer"]],
  ["Terminal multiplexer with tmux", "tmux", "Starts a terminal session with panes and windows.", ["tmux", "terminal panes", "persistent terminal", "terminal multiplexer"]]
];

commands.push(...extendedCommands.map(([name, command, description, keywords, example]) =>
  entry(name, command, description, keywords, example)
));

// ---------- Search helpers ----------

function normalize(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9+.#/_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text) {
  return normalize(text)
    .split(" ")
    .filter(token => token.length >= 2);
}

function searchableText(item) {
  const flags = (item.flags || []).map(([flag, meaning]) => `${flag} ${meaning}`).join(" ");
  return normalize([
    item.name,
    item.command,
    item.description,
    item.category,
    ...(item.keywords || []),
    flags
  ].join(" "));
}

function scoreCommand(item, query) {
  const q = normalize(query);
  if (!q) return 0;

  const fullText = searchableText(item);
  const queryTokens = tokenize(q);
  let score = 0;

  // Strong match: the whole query appears in a keyword.
  (item.keywords || []).forEach(keyword => {
    const k = normalize(keyword);

    if (k === q) score += 100;
    else if (k.includes(q)) score += 60;
    else if (q.includes(k)) score += 35;
  });

  // Direct command/name matches.
  if (normalize(item.name) === q) score += 120;
  if (normalize(item.command).includes(q)) score += 80;
  if (normalize(item.description).includes(q)) score += 40;

  // Simple token matching.
  queryTokens.forEach(token => {
    if (fullText.includes(token)) score += 8;
  });

  return score;
}

function searchCommands(query) {
  if (!normalize(query)) return [];

  return commands
    .map(item => ({
      item,
      score: scoreCommand(item, query)
    }))
    .filter(result => result.score >= CONFIG.minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, CONFIG.maxResults);
}

// ---------- Category helpers ----------

const CATEGORY_ORDER = [
  "Files", "Processes", "Networking", "Permissions",
  "System", "Text", "User Management", "Linux"
];

function categoryCounts() {
  const counts = {};
  commands.forEach(item => {
    counts[item.category] = (counts[item.category] || 0) + 1;
  });
  return counts;
}

function orderedCategories() {
  const counts = categoryCounts();
  return CATEGORY_ORDER.filter(category => counts[category]);
}

// ---------- Favorites (stored in this browser only, via localStorage) ----------

const FAVORITES_KEY = "linuxIntentFavorites";

function getFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function isFavorite(id) {
  return getFavorites().includes(id);
}

function toggleFavorite(id) {
  const favorites = getFavorites();
  const index = favorites.indexOf(id);
  if (index === -1) favorites.push(id);
  else favorites.splice(index, 1);
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (error) {
    // Storage unavailable (private browsing, etc.) — favorites just won't persist.
  }
  return favorites;
}

function updateFavoritesBadge() {
  const badge = document.getElementById("favCount");
  if (!badge) return;
  const count = getFavorites().length;
  badge.textContent = count ? `(${count})` : "";
}

function syncFavoriteButtons() {
  const favorites = new Set(getFavorites());
  document.querySelectorAll(".fav-btn").forEach(button => {
    const active = favorites.has(button.dataset.fav);
    button.textContent = active ? "\u2605" : "\u2606";
    button.setAttribute("aria-pressed", active ? "true" : "false");
    button.classList.toggle("is-active", active);
  });
}

// ---------- Copy to clipboard ----------

function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }
  return new Promise((resolve, reject) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      document.execCommand("copy");
      resolve();
    } catch (error) {
      reject(error);
    } finally {
      document.body.removeChild(textarea);
    }
  });
}

// ---------- Rendering ----------

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[character]));
}

function renderFlags(flags) {
  flags = flags || [];
  if (!CONFIG.showFlags || !flags.length) return "";

  return `
    <div class="flags">
      <strong>Flags / functions</strong>
      <ul>
        ${flags.map(([flag, meaning]) => `
          <li><code>${escapeHTML(flag)}</code> \u2014 ${escapeHTML(meaning)}</li>
        `).join("")}
      </ul>
    </div>
  `;
}

function renderExamples(examples) {
  examples = examples || [];
  if (!CONFIG.showExamples || !examples.length) return "";

  return `
    <div class="examples">
      <strong>Examples</strong>
      ${examples.map(example => `
        <div class="example-row">
          <code class="example-command">${escapeHTML(example)}</code>
          <button type="button" class="copy-btn copy-btn-small">Copy</button>
        </div>
      `).join("")}
    </div>
  `;
}

function renderRelated(related) {
  if (!related || !related.length) return "";

  return `
    <div class="related">
      <strong>Related commands</strong>
      <div class="related-links">
        ${related.map(id => `<button type="button" data-query="${escapeHTML(id)}">${escapeHTML(id)}</button>`).join("")}
      </div>
    </div>
  `;
}

function renderCard(item) {
  const favorited = isFavorite(item.id);
  return `
    <article class="result-card" data-category="${escapeHTML(item.category)}">
      <div class="result-header">
        <div>
          <h2>${escapeHTML(item.name)}</h2>
          ${CONFIG.showCategories
            ? `<span class="category">${escapeHTML(item.category)}</span>`
            : ""}
        </div>
        <button
          type="button"
          class="fav-btn${favorited ? " is-active" : ""}"
          data-fav="${escapeHTML(item.id)}"
          aria-pressed="${favorited ? "true" : "false"}"
          title="Save to favorites"
        >${favorited ? "\u2605" : "\u2606"}</button>
      </div>

      <div class="command-row">
        <code class="main-command">${escapeHTML(item.command)}</code>
        <button type="button" class="copy-btn">Copy</button>
      </div>

      <p class="description">${escapeHTML(item.description)}</p>

      ${renderFlags(item.flags)}
      ${renderExamples(item.examples)}
      ${renderRelated(item.related)}

      ${CONFIG.showNotes && item.notes
        ? `<p class="note"><strong>Note:</strong> ${escapeHTML(item.notes)}</p>`
        : ""}
    </article>
  `;
}

function renderEmptyState(query) {
  if (!query) {
    return `
      <div class="empty-state">
        <h2>What do you want to do?</h2>
        <p>Try things like:</p>
        <div class="suggestions">
          <button data-query="delete a folder">delete a folder</button>
          <button data-query="check running processes">check running processes</button>
          <button data-query="find a file">find a file</button>
          <button data-query="show open ports">show open ports</button>
          <button data-query="change permissions">change permissions</button>
          <button data-query="check disk space">check disk space</button>
        </div>
      </div>
    `;
  }

  return `
    <div class="empty-state">
      <h2>No matching command</h2>
      <p>Try simpler words such as <b>delete</b>, <b>process</b>, <b>network</b>, <b>permission</b>, <b>file</b>, or <b>disk</b>.</p>
    </div>
  `;
}

function renderResults(query) {
  const resultsElement = document.getElementById("results");
  const metaElement = document.getElementById("resultMeta");

  const matches = searchCommands(query);

  if (!normalize(query)) {
    metaElement.textContent = `${commands.length} commands available`;
    resultsElement.innerHTML = renderEmptyState("");
    return;
  }

  metaElement.textContent = matches.length
    ? `Found ${matches.length} matching command${matches.length === 1 ? "" : "s"} for \u201c${query}\u201d`
    : `No matches for \u201c${query}\u201d`;

  resultsElement.innerHTML = matches.length
    ? matches.map(({ item }) => renderCard(item)).join("")
    : renderEmptyState(query);

  syncFavoriteButtons();
}

// ---------- Categories view ----------

function renderCategories() {
  const grid = document.getElementById("categoryGrid");
  const counts = categoryCounts();

  grid.innerHTML = orderedCategories().map(category => `
    <button type="button" class="category-card" data-category="${escapeHTML(category)}">
      <span class="category-card-name">${escapeHTML(category)}</span>
      <span class="category-card-count">${counts[category]} command${counts[category] === 1 ? "" : "s"}</span>
    </button>
  `).join("");
}

function showCategoryDetail(category) {
  const detail = document.getElementById("categoryDetail");
  const items = commands.filter(item => item.category === category);

  detail.innerHTML = `
    <h2 class="category-detail-title">${escapeHTML(category)}</h2>
    ${items.map(renderCard).join("")}
  `;

  syncFavoriteButtons();
}

function setupCategoryGrid() {
  document.getElementById("categoryGrid").addEventListener("click", event => {
    const card = event.target.closest(".category-card");
    if (!card) return;

    document.querySelectorAll(".category-card").forEach(other => {
      other.classList.toggle("is-active", other === card);
    });

    showCategoryDetail(card.dataset.category);
  });
}

// ---------- Cheat sheet view ----------

function renderCheatSheet() {
  const container = document.getElementById("cheatsheetList");

  container.innerHTML = orderedCategories().map(category => `
    <section class="cheat-section">
      <h2>${escapeHTML(category)}</h2>
      <ul class="cheat-list">
        ${commands.filter(item => item.category === category).map(item => `
          <li>
            <code>${escapeHTML(item.command)}</code>
            <span class="cheat-desc">${escapeHTML(item.description)}</span>
          </li>
        `).join("")}
      </ul>
    </section>
  `).join("");
}

// ---------- Favorites view ----------

function renderFavoritesView() {
  const container = document.getElementById("favoritesList");
  const favorites = getFavorites();
  const items = commands.filter(item => favorites.includes(item.id));

  container.innerHTML = items.length
    ? items.map(renderCard).join("")
    : `
      <div class="empty-state">
        <h2>No favorites yet</h2>
        <p>Star a command from Search or Categories to save it here. Favorites stay in this browser.</p>
      </div>
    `;

  syncFavoriteButtons();
}

// ---------- Practice view ----------

let currentQuestion = null;
let practiceScore = { correct: 0, total: 0 };

function shuffle(list) {
  return [...list].sort(() => Math.random() - 0.5);
}

function pickQuestion() {
  const correct = commands[Math.floor(Math.random() * commands.length)];
  const distractorPool = commands.filter(item => item.id !== correct.id);
  const distractors = shuffle(distractorPool).slice(0, 3);
  const options = shuffle([correct, ...distractors]);
  currentQuestion = { correct, options };
  return currentQuestion;
}

function renderQuestion() {
  const area = document.getElementById("practiceArea");
  const question = currentQuestion || pickQuestion();

  area.innerHTML = `
    <p class="practice-score">Score: ${practiceScore.correct} / ${practiceScore.total}</p>
    <div class="practice-card">
      <p class="practice-prompt">Which command does this?</p>
      <p class="practice-description">${escapeHTML(question.correct.description)}</p>
      <div class="practice-options">
        ${question.options.map(option => `
          <button type="button" class="practice-option" data-id="${escapeHTML(option.id)}">
            ${escapeHTML(option.command)}
          </button>
        `).join("")}
      </div>
      <div class="practice-feedback" id="practiceFeedback"></div>
    </div>
  `;
}

function handlePracticeClick(event) {
  const nextButton = event.target.closest("#nextQuestion");
  if (nextButton) {
    pickQuestion();
    renderQuestion();
    return;
  }

  const optionButton = event.target.closest(".practice-option");
  if (!optionButton || optionButton.disabled) return;

  const chosenId = optionButton.dataset.id;
  const correctId = currentQuestion.correct.id;
  practiceScore.total += 1;

  document.querySelectorAll(".practice-option").forEach(button => {
    button.disabled = true;
    if (button.dataset.id === correctId) button.classList.add("is-correct");
  });

  const feedback = document.getElementById("practiceFeedback");
  const scoreLine = document.querySelector(".practice-score");

  if (chosenId === correctId) {
    practiceScore.correct += 1;
    feedback.innerHTML = `
      <p class="feedback-correct">Correct.</p>
      <button type="button" id="nextQuestion" class="next-btn">Next question</button>
    `;
  } else {
    optionButton.classList.add("is-incorrect");
    feedback.innerHTML = `
      <p class="feedback-incorrect">Not quite. The correct command was <code>${escapeHTML(currentQuestion.correct.command)}</code>.</p>
      <button type="button" id="nextQuestion" class="next-btn">Next question</button>
    `;
  }

  if (scoreLine) scoreLine.textContent = `Score: ${practiceScore.correct} / ${practiceScore.total}`;
}

// ---------- View switching ----------

let currentView = "search";

function setActiveView(view) {
  currentView = view;

  document.querySelectorAll(".nav-item").forEach(button => {
    button.classList.toggle("is-active", button.dataset.view === view);
  });

  document.querySelectorAll(".view").forEach(section => {
    section.classList.toggle("is-active", section.dataset.view === view);
  });

  if (view === "favorites") renderFavoritesView();
}

function setupNav() {
  document.querySelectorAll(".nav-item").forEach(button => {
    button.addEventListener("click", () => setActiveView(button.dataset.view));
  });
}

// ---------- Global click handling (favorites, copy, related-command jumps) ----------

function handleGlobalClick(event) {
  const favButton = event.target.closest(".fav-btn");
  if (favButton) {
    toggleFavorite(favButton.dataset.fav);
    syncFavoriteButtons();
    updateFavoritesBadge();
    if (currentView === "favorites") renderFavoritesView();
    return;
  }

  const copyButton = event.target.closest(".copy-btn");
  if (copyButton) {
    const codeElement = copyButton.previousElementSibling;
    if (!codeElement) return;
    const original = copyButton.textContent;
    copyText(codeElement.textContent).then(() => {
      copyButton.textContent = "Copied";
      setTimeout(() => { copyButton.textContent = original; }, 1200);
    }).catch(() => {});
    return;
  }

  const queryButton = event.target.closest("[data-query]");
  if (queryButton) {
    setActiveView("search");
    const input = document.getElementById("search");
    input.value = queryButton.dataset.query;
    input.focus();
    renderResults(input.value);
  }
}

// ---------- Init ----------

function handleSearch(event) {
  renderResults(event.target.value);
}

function init() {
  const searchInput = document.getElementById("search");
  searchInput.addEventListener("input", handleSearch);
  renderResults("");

  setupNav();
  renderCategories();
  setupCategoryGrid();
  renderCheatSheet();

  document.getElementById("practiceArea").addEventListener("click", handlePracticeClick);
  pickQuestion();
  renderQuestion();

  document.body.addEventListener("click", handleGlobalClick);

  updateFavoritesBadge();
  syncFavoriteButtons();
}

document.addEventListener("DOMContentLoaded", init);

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("themeToggle");
  const menu = document.getElementById("menuButton");
  const sidebar = document.getElementById("sidebar");
  if (localStorage.getItem("linuxIntentTheme") === "light") document.body.classList.add("light");
  toggle?.addEventListener("click", () => {
    document.body.classList.toggle("light");
    localStorage.setItem("linuxIntentTheme", document.body.classList.contains("light") ? "light" : "dark");
  });
  menu?.addEventListener("click", () => sidebar?.classList.toggle("open"));
});
